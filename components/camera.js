var lookat = require('lookat-camera')

module.exports = function () {
  var camera = lookat()
  camera.up = [0, 0, 1]
  camera.target = [0, 0, 0]
  camera.position = [-10, -10, 30]
  return camera
}
