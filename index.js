var Camera = require('./components/camera.js')
var Scene = require('./components/scene.js')

module.exports = function (game, gl) {
  var scene = Scene(gl)
  var camera = Camera()

  scene.build(game.objects)

  game.gameloop.on('draw', function (context) {
    scene.update(camera)
    scene.draw(context, camera)
  })

  game.on('collected', function (id) {
    scene.remove(id)
  })
}