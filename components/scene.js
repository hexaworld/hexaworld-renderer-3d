var Shader = require('gl-shader')
var Geometry = require('gl-geometry')
var glslify = require('glslify')
var mat4 = require('gl-mat4')
var eye = require('eye-vector')
var normals = require('normals')
var unindex = require('unindex-mesh')
var reindex = require('mesh-reindex')
var extrude = require('extrude')
var camel = require('camelcase')
var attributes = require('./attributes.js')


function Scene(gl) {
  if (!(this instanceof Scene)) return new Scene(gl)
  this.gl = gl
  this.init()
}

Scene.prototype.init = function () {
  var self = this

  this.proj = mat4.create()
  this.view = mat4.create()
  this.eye = new Float32Array(3)

  var aspect = self.gl.drawingBufferWidth / self.gl.drawingBufferHeight
  mat4.perspective(self.proj, Math.PI / 4, aspect, 0.01, 1000)
}

Scene.prototype.build = function (objects) {
  var self = this
  console.log(objects)
  self.shapes = objects.map(function (object) {
    return self.create(object)
  })
}

Scene.prototype.create = function (object) {
  var self = this

  var attr = attributes[camel(object.type)]

  var shader = Shader(self.gl,
    glslify('../shaders/flat.vert'),
    glslify('../shaders/flat.frag')
  )

  var geometry = Geometry(self.gl)

  if (attr.shape == 'extrusion') {
    var complex = extrude(object.points, {top: attr.top, bottom: attr.bottom})
    var flattened = unindex(complex.positions, complex.cells)
    complex = reindex(flattened)
    complex.normals = normals.vertexNormals(complex.cells, complex.positions)
    geometry.attr('position', complex.positions)
    geometry.attr('normal', complex.normals)
    geometry.faces(complex.cells)
  }

  return {
    shader: shader,
    geometry: geometry
  }
}

Scene.prototype.draw = function (gl) {
  var self = this

  self.shapes.forEach(function (shape) {
    shape.geometry.bind(shape.shader)
    shape.shader.uniforms.proj = self.proj
    shape.shader.uniforms.view = self.view
    shape.shader.uniforms.eye = self.eye
    shape.geometry.draw(gl.LINES)
    shape.geometry.unbind()
  })

}

Scene.prototype.update = function (camera) {
  var self = this
  camera.view(self.view)
}

Scene.prototype.remove = function () {

  // remove geometries with the given ids

}

module.exports = Scene