var Scene = require('./components/scene.js')
var View = require('./components/view.js')

module.exports = function (opts) {
  var game = opts.game
  var gl = opts.gl

  var scene = Scene(gl)
  var view = View('lookat', gl)

  var styles = {
    shapes: require('./styles/shapes.js'), 
    lights: require('./styles/lights.js')
  }

  scene.build(game.objects, styles)

  game.on('draw', function () {
    view.update()
    scene.update(view)
    scene.draw(gl, view)
  })

  game.on('consume', function (e) {
    scene.remove(e.id, e.type)
  })

  game.on('move', function (e) {
    scene.move(e.id, e.transform)
    if (e.id === 'player' & view.type === 'lookat') view.move(e.transform)
  })
}