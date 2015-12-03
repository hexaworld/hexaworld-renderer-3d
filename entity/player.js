var inherits = require('inherits')
var mouse = require('../geometry/mouse.js')
var Collision = require('../util/collision.js')
var Fixmove = require('../movement/fixmove.js')
var Automove = require('../movement/automove.js')
var Entity = require('crtrdg-entity')

module.exports = Player
inherits(Player, Entity)

function Player (opts) {
  this.geometry = mouse({
    translation: opts.translation,
    rotation: opts.rotation,
    fill: opts.fill,
    stroke: opts.stroke,
    scale: opts.scale,
    thickness: opts.thickness
  })
  this.movement = {}
  this.movement.center = new Fixmove({speed: opts.speed})
  this.movement.tile = new Automove({
    keymap: ['A', 'D', 'W', '<left>', '<right>', '<up>'],
    heading: [-60, 60, 0, -60, 60, 0],
    shift: [0, 0, 8, 0, 0, 8],
    speed: opts.speed
  })
  this.movement.path = new Automove({
    keymap: ['W', 'S', '<up>', '<down>'],
    heading: [0, 0, 0, 0],
    shift: [1, -1, 1, -1],
    speed: opts.speed
  })
  this.collision = new Collision()
  this.waiting = true
}

Player.prototype.move = function (keyboard, world) {
  var self = this

  var current = self.geometry.transform
  var tile = world.tiles[world.locate(current.translation)]
  var inside = tile.children[0].contains(current.translation)
  var keys = keyboard.keysDown

  var delta
  if (inside) {
    if (self.movement.tile.keypress(keys)) self.waiting = false
    if (self.waiting) {
      var center = {
        translation: [tile.transform.translation[0], tile.transform.translation[1]]
      }
      delta = self.movement.center.compute(current, center)
    } else {
      delta = self.movement.tile.compute(keys, current, tile.transform)
    }
    self.movement.path.reset()
    self.movement.path.clear()
  } else {
    self.waiting = true
    self.movement.tile.reset()
    delta = self.movement.path.compute(keys, current)
  }

  self.geometry.update(delta)
  self.collision.handle(world, self.geometry, delta)
}

Player.prototype.draw = function (context, camera) {
  this.geometry.draw(context, camera, {order: 'bottom'})
}
