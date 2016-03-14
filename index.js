var Scene = require('gl-scene')
var lookat = require('lookat-camera')
var convert = require('./conversion/convert.js')
var stylesheet = require('./style-3d.js')

module.exports = function (opts) {
  var gl = opts.gl
  var game = opts.game
  var objects = game.objects

  var scene = Scene(gl)

  shapes = convert.shapes(objects)
  lights = convert.lights(objects)

  scene.shapes(shapes)
  scene.lights(lights)
  scene.materials({'foggy': require('./materials/foggy')})
  scene.stylesheet(stylesheet)
  scene.init()

  var camera = lookat()

  var player = scene.select('#player')
  var playerLight = scene.select('#player-light')
  scene.select('.cue-0').classed('inactive', true)
  scene.select('.cue-1').classed('inactive', true)
  scene.select('.cue-2').classed('inactive', true)
  scene.select('.cue-3').classed('inactive', true)

  game.on('draw', function () {
    scene.draw(camera)
  })

  game.on('consume', function (e) {
    scene.select(e.id).hide()
  })

  game.on('enter', function (e) {
    console.log(e)
  })

  game.on('activate', function (e) {
    scene.select(e.id).classed('inactive', false)
    scene.select(e.id + '-light').classed('active', true)
  })

  var k = 0

  game.on('move', function (e) {
    var t = e.transform.translation
    var r = e.transform.rotation * Math.PI / 180
    player.position(function (p) {
      return [t[0], t[1], p[2] + Math.sin(k) / 15]
    })
    player.rotation(r, [0, 0, 1])
    playerLight.position(function (p) {
      return [t[0], t[1], p[2] + Math.sin(k) / 8]
    })
    setCamera(t, r)
    k += 0.2
  })

  function setCamera (t, r) {
    var vec1 = [t[0] + Math.sin(-r) * 20, t[1] + Math.cos(-r) * 20]
    var vec2 = [t[0] - Math.sin(-r) * 50, t[1] - Math.cos(-r) * 50]
    camera.target = [vec1[0], vec1[1], 5]
    camera.position = [vec2[0], vec2[1], 20]
    camera.up = [0, 0, 1]
  }
}