var Scene = require('./components/scene.js')
var View = require('./components/view.js')

module.exports = function (game, gl) {
  var scene = Scene(gl)
  var view = View('lookat', gl)

  scene.build(game.objects)

  game.gameloop.on('draw', function (context) {
    scene.update(view)
    scene.draw(context, view)
  })

  game.on('collected', function (id) {
    scene.remove(id)
  })
}