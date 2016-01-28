var Shader = require('gl-shader')
var Geometry = require('gl-geometry')
var mat4 = require('gl-mat4')
var eye = require('eye-vector')
var normals = require('normals')
var unindex = require('unindex-mesh')
var reindex = require('mesh-reindex')
var combine = require('mesh-combine')
var extrude = require('extrude')
var icosphere = require('icosphere')
var camel = require('camelcase')
var glslify = require('glslify')
var distance = require('euclidean-distance')


function Scene(gl) {
  if (!(this instanceof Scene)) return new Scene(gl)
  this.gl = gl
  this.width = this.gl.drawingBufferWidth
  this.height = this.gl.drawingBufferHeight
  this.init()
}

Scene.prototype.init = function () {
  var self = this
  this.proj = mat4.create()
  this.view = mat4.create()
  this.eye = new Float32Array(3)
  mat4.perspective(self.proj, Math.PI / 4, self.width / self.height, 0.01, 1000)
}

Scene.prototype.build = function (objects, styles) {
  var self = this

  // set shape attributes on objects
  _.forEach(objects, function (object) { 
    var attr = styles.shapes[camel(object.type)]
    _.defaults(object, attr)
  })

  // build a simplicial complex for each object
  _.filter(objects, ['render', true]).forEach(function (object) { 
    object.complex = self.buildSimplicial(object)
    object.centroid = object.complex.positions.reduce(function (x, y) {
      return [x[0] + y[0], x[1] + y[1], x[2] + y[2]]
    }).map(function (p) {return p / object.complex.positions.length})
  })

  // iterate over unique types and merge meshes
  var types = _.uniq(_.map(objects, 'type'))
  _.forEach(types, function (type) {
    var filtered = _.filter(objects, ['type', type])
    var canmerge = _.every(filtered, 'mergeable') & filtered.length > 1
    if (canmerge) {
      var merged = self.merge(filtered)
      _.forEach(filtered, function (object) {object.render = false})
      objects.push(merged)
    }
  })

  // collect light sources
  var light, style
  var lights = {colors: [], positions: []}
  _.forEach(objects, function (object) {
    style = styles.lights[camel(object.type)]
    if (style) {
      light = self.buildLight(object, style)
      lights.colors.push(light.color)
      lights.positions.push(light.position)
    }
  })
  lights.count = lights.positions.length
  lights.distances = {}
  objects.forEach(function (object) {
    lights.distances[object.id] = lights.positions.map(function (l) {
      return distance(object.centroid, l)
    }).reduce(function (x, y) { return Math.min(x, y)})
  })

  // create shaders
  var shaders = {
    flat: Shader(self.gl,
      glslify('../shaders/flat.vert'),
      glslify('../shaders/flat.frag').replace(/LIGHTCOUNT/g, lights.count)
    )
  }

  // setup geometries
  _.filter(objects, ['render', true]).forEach(function (object) {
    object.complex = reindex(unindex(object.complex.positions, object.complex.cells))
    object.geometry = self.buildGeometry(object.complex)
    object.shader = shaders[object.shader]
    object.move = mat4.create()
  })

  self.objects = objects
  self.lights = lights
  self.shaders = shaders
}

Scene.prototype.buildLight = function (object, style) {
  var p = object.points[0]
  return {
    color: style.color,
    position: [p[0], p[1], style.height]
  }
}

Scene.prototype.buildSimplicial = function (object) {
  var gen = object.generator
  var complex

  if (gen.type == 'extrude') {
    complex = extrude(object.points, {top: gen.top, bottom: gen.bottom})
  }

  if (gen.type == 'icosphere') {
    complex = icosphere(0)
    complex.positions = complex.positions.map(function (p) {
      var t = object.points[0]
      return [
        p[0] * gen.radius + t[0], 
        p[1] * gen.radius + t[1], p[2] * gen.radius + gen.height
      ]
    })
  }

  return complex
}

Scene.prototype.buildGeometry = function (complex) {
  var self = this

  var geometry = Geometry(self.gl)
  geometry.attr('position', complex.positions)
  geometry.attr('normal', normals.vertexNormals(complex.cells, complex.positions))
  geometry.faces(complex.cells)

  return geometry
}

Scene.prototype.merge = function (objects) {
  var ids = _.map(objects, 'id')
  var combined = combine(_.map(_.filter(objects, 'render'), 'complex'))
  var merged = {complex: combined, id: 'merged: ' + objects[0].type}
  _.defaults(merged, objects[0])
  return merged
}

Scene.prototype.draw = function () {
  var self = this

  self.gl.enable(self.gl.DEPTH_TEST)

  _.forEach(self.objects, function (object) {
    if (object.render) {
      var passed = true
      if (object.hide) {
        var p = object.centroid
        var e = self.eye
        var d = distance(p, e)
        if (d > 200) {
          passed = self.lights.distances[object.id] < 50
        } 
      }
      if (passed) {
        object.geometry.bind(object.shader)
        object.shader.uniforms.proj = self.proj
        object.shader.uniforms.view = self.view
        object.shader.uniforms.eye = self.eye
        object.shader.uniforms.move = object.move
        object.shader.uniforms.lit = object.lit 
        object.shader.uniforms.fog = object.fog
        object.shader.uniforms.color = object.color
        object.shader.uniforms.lightPositions = self.lights.positions
        object.shader.uniforms.lightColors = self.lights.colors
        object.geometry.draw(self.gl.TRIANGLES)
        object.geometry.unbind()
      }
    }
  })
}

Scene.prototype.update = function (view) {
  var self = this
  view.camera.view(self.view)
  eye(self.view, self.eye)
}

Scene.prototype.move = function (id, transform) {
  var self = this
  var object = self.find(id)
  var t = transform.translation
  var r = transform.rotation / 180 * Math.PI
  mat4.identity(object.move)
  mat4.translate(object.move, object.move, [t[0], t[1], 0])
  mat4.rotateZ(object.move, object.move, r)
}

Scene.prototype.remove = function (id) {
  var self = this
  var object = self.find(id)
  object.render = false
}

Scene.prototype.find = function (id) {
  var self = this
  return _.find(self.objects, ['id', id])
}

module.exports = Scene