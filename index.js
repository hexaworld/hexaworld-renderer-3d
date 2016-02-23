var Scene = require('./components/scene.js')
var View = require('./components/view.js')
var convert = require('./conversion/convert.js')

module.exports = function (opts) {
  var gl = opts.gl
  var game = opts.game
  var objects = game.objects

  var scene = Scene(gl)
  var view = View('orbit', gl)

  var opts = {
    shapes: require('./styles/shapes.js'), 
    lights: require('./styles/lights.js')
  }

  shapes = convert.shapes(objects)
  lights = convert.lights(objects)

  scene.shapes(shapes, opts.shapes)
  scene.lights(lights, opts.lights)
  scene.shader()

  game.on('draw', function () {
    view.update()
    scene.update(view)
    scene.draw()
  })

  game.on('consume', function (e) {
    scene.remove(e.id, e.type)
  })

  game.on('move', function (e) {
    scene.move(e.id, function (mat) {
      var m = e.transform.tomat()
      mat[0] = m[0]
      mat[1] = m[1]
      mat[4] = m[3]
      mat[5] = m[4]
      mat[12] = m[6]
      mat[13] = m[7]
    })
    if (e.id === 'player' & view.type === 'lookat') view.move(e.transform.tomat())
  })
}