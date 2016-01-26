var Scene = require('./components/scene.js')
var View = require('./components/view.js')

module.exports = function (game, gl) {
  var scene = Scene(gl)
  var view = View('lookat', gl)

  scene.build(game.objects, {shapes: shapes, lights: lights})

  game.gameloop.on('draw', function (gl) {
    scene.update(view)
    scene.draw(gl, view)
  })

  game.on('collected', function (id) {
    scene.remove(id)
  })
}