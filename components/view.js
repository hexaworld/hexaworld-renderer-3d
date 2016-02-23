var lookat = require('lookat-camera')
var orbit = require('canvas-orbit-camera')

module.exports = View

function View (type, gl) {
  if (!(this instanceof View)) return new View(type, gl)    
  this.type = type || 'orbit'

  if (type === 'lookat'){
    var camera = lookat()
    camera.up = [0, 0, 1]
    camera.target = [0, 9, 1]
    camera.position = [0, -60, 30]
    this.camera = camera
  }

  if (type === 'orbit') {
    this.camera = orbit(gl.canvas)
  }
}

View.prototype.update = function () {
  if (this.type === 'orbit') this.camera.tick()
}

View.prototype.move = function (mat) {
  var t = this.camera.target
  var p = this.camera.position
  this.camera.target = [mat[6], mat[7] + 9, t[2]]
  this.camera.position = [mat[6], mat[7] - 60, p[2]]
}