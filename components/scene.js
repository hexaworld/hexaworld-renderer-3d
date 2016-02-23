var Shader = require('gl-shader')
var Geometry = require('gl-geometry')
var mat4 = require('gl-mat4')
var eye = require('eye-vector')
var normals = require('normals')
var glslify = require('glslify')
var camel = require('camelcase')
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
  this.frame = 0
  this.props = {}
  this.proj = mat4.create()
  this.view = mat4.create()
  this.eye = new Float32Array(3)
  mat4.perspective(self.proj, Math.PI / 4, self.width / self.height, 0.01, 1000)
}

Scene.prototype.shapes = function (objects, opts) {
  var self = this

  var props = _.uniq(_.flatten(_.map(opts, function (opt) {return _.keys(opt)})))
  
  _.forEach(objects, function (object) {
    var attr = opts[camel(object.type)]
    _.defaults(object, attr)
  })

  _.forEach(objects, function (object) {
    var complex = object.complex
    object.geometry = Geometry(self.gl)
    object.geometry.attr('position', complex.positions)
    object.geometry.attr('normal', normals.vertexNormals(complex.cells, complex.positions))
    object.geometry.faces(complex.cells)
    object.animate = mat4.create()
    object.render = true
  })

  self._shapes = objects
  self.props.shapes = props
}

Scene.prototype.lights = function (objects, opts) {
  var self = this

  var lights = {keys: {}}

  var props = _.uniq(_.flatten(_.map(opts, function (opt) {return _.keys(opt)})))
  props.push('position')

  _.forEach(objects, function (object, index) {
    lights.keys[object.type] = index
  })

  _.forEach(props, function (prop) {
    lights[prop] = []
  })

  _.forEach(objects, function (object) {
    _.forEach(props, function (prop) {
      var index = lights.keys[object.type]
      if (prop === 'position') {
        lights[prop][index] = [object.move[12], object.move[13], object.move[14]]
      } else {
        lights[prop][index] = opts[camel(object.type)][prop]
      }
    })
  })

  // precompute nearest light to each object
  // objects.forEach(function (object) {
  //   object.nearestLight = _.map(lights.sources, function (l) {
  //     return distance(object.centroid, l.position)
  //   }).reduce(function (x, y) { return Math.min(x, y)})
  // })

  self._lights = lights
  self.props.lights = props
}

Scene.prototype.shader = function () {
  var self = this

  var shader = Shader(self.gl,
    glslify('../shaders/flat.vert'),
    glslify('../shaders/flat.frag').replace(/LIGHTCOUNT/g, _.keys(self._lights.keys).length)
  )

  self._shader = shader
}

Scene.prototype.draw = function () {
  var self = this

  self.gl.enable(self.gl.DEPTH_TEST)

  _.forEach(self._shapes, function (shape) {
    if (shape.render) {
      var passed = true
      // if (object.hide) {
      //   var p = object.centroid
      //   var e = self.eye
      //   var d = distance(p, e)
      //   if (d > 200) {
      //     passed = object.nearestLight < 50
      //   } 
      // }
      if (passed) {
        shape.geometry.bind(self._shader)
        self._shader.uniforms.proj = self.proj
        self._shader.uniforms.view = self.view
        self._shader.uniforms.eye = self.eye
        self._shader.uniforms.move = shape.move
        self._shader.uniforms.animate = shape.animate
        _.forEach(self.props.shapes, function (prop) {
          self._shader.uniforms[prop] = shape[prop]
        })
        _.forEach(self.props.lights, function (prop) {
          self._shader.uniforms['l' + prop + 'v'] = self._lights[prop]
        })
        shape.geometry.draw(self.gl.TRIANGLES)
        shape.geometry.unbind()
      }
    }
  })

}

Scene.prototype.update = function (view) {
  var self = this
  view.camera.view(self.view)
  eye(self.view, self.eye)
  this.frame += 1
}

Scene.prototype.move = function (id, cb) {
  var self = this
  var shape = self.find(id)
  var light = self.find(id)

  cb(shape.move)

  // if (mat.length == 9) {
  //   shape.move[0] = mat[0]
  //   shape.move[1] = mat[1]
  //   shape.move[4] = mat[3]
  //   shape.move[5] = mat[4]
  //   shape.move[12] = mat[6]
  //   shape.move[13] = mat[7]

  //   if (self._lights.keys[id]) {
  //     var ind = self._lights.keys[id]
  //     self._lights.position[ind][0] = mat[6]
  //     self._lights.position[ind][1] = mat[7]
  //   }
  // }

  // if (mat.length == 16) {
  //   shape.move = mat
  //   if (self._lights.keys[id]) {
  //     var ind = self._lights.keys[id]
  //     self._lights.position[ind][0] = mat[12]
  //     self._lights.position[ind][1] = mat[13]
  //     self._lights.position[ind][2] = mat[14]
  //   }
  // }
}

Scene.prototype.remove = function (id) {
  var self = this
  var shape = self.find(id)
  shape.render = false
}

Scene.prototype.find = function (id) {
  var self = this
  return _.find(self._shapes, ['id', id])
}

module.exports = Scene