var lookat = require('lookat-camera')
var orbit = require('canvas-orbit-camera')

module.exports = View

function View (type, gl) {
  if (!(this instanceof View)) return new View(type, gl)    
  this.type = type || 'orbit'

  if (type === 'lookat'){
    var camera = lookat()
    camera.up = [0, 0, 1]
    camera.target = [0, 0, 0]
    camera.position = [1, 0, 75]
    this.camera = camera
  }

  if (type === 'orbit') {
    this.camera = orbit(gl.canvas)
  }
}

View.prototype.update = function () {
  if (this.type === 'orbit') this.camera.tick()
}

View.prototype.move = function (transform) {
  var t = transform.translation
  this.camera.target = [t[0], t[1] + 20, 1]
  this.camera.position = [t[0], t[1] - 60, 30]
}