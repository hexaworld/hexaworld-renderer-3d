var Scene = require('gl-scene')
var orbit = require('canvas-orbit-camera')
var convert = require('./conversion/convert.js')

module.exports = function (opts) {
  var gl = opts.gl
  var game = opts.game
  var objects = game.objects

  var scene = Scene(gl)

  var opts = {
    shapes: require('./styles/shapes.js'), 
    lights: require('./styles/lights.js')
  }

  shapes = convert.shapes(objects)
  lights = convert.lights(objects)

  console.log(lights)
  console.log(shapes)

  scene.shapes(shapes)
  scene.init()

  var camera = orbit(gl.canvas)

  game.on('draw', function () {
    scene.draw(camera)
  })

  game.on('consume', function (e) {
    scene.select(e.id).hide()
  })

  game.on('move', function (e) {
    var player = scene.select(e.id)
    player.position(function (p) {return [e.transform.translation[0], e.transform.translation[1], p[2]]})
    player.rotation(e.transform.rotation * Math.PI / 180, [0, 0, 1])
  })
}