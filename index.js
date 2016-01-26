var Scene = require('./components/scene.js')
var View = require('./components/view.js')

module.exports = function (game, gl) {
  var scene = Scene(gl)
  var view = View('lookat', gl)
  
  var styles = {
    shapes: require('./styles/shapes.js'), 
    lights: require('./styles/lights.js')
  }

  scene.build(game.objects, styles)

  game.gameloop.on('draw', function (gl) {
    scene.update(view)
    scene.draw(gl, view)
  })

  game.on('collected', function (id) {
    scene.remove(id)
  })
}