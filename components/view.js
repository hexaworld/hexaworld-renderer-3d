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
    camera.position = [15, 15, 200]
    this.camera = camera
  }

  if (type === 'orbit') {
    this.camera = orbit(gl.canvas)
  }
}
