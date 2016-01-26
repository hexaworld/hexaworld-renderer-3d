var shapes = {
  platform: {
    color: [0.3, 0.3, 0.3],
    generator: {type: 'extrusion', bottom: 1, top: 4},
  },

  floor: {
    color: [0.2, 0.2, 0.2],
    lit: false,
    generator: {type: 'extrusion', bottom: 0, top: 1},
  },

  player: {
    color: [0.7, 0.7, 0.7],
    fogged: false,
    generator: {type: 'sphere', height: 8, radius: 2},
  },

  cue0: {
    color: [0.87, 0.52, 0.23],
    fogged: false,
    generator: {type: 'sphere', height: 12, radius: 2},
  },

  cue1: {
    color: [0.00, 0.76, 0.93],
    fogged: false,
    generator: {type: 'sphere', height: 12, radius: 2},
  },

  cue2: {
    color: [0.51, 0.79, 0.29],
    fogged: false,
    generator: {type: 'sphere', height: 12, radius: 2},
  },

  cue3: {
    color: [0.81, 0.33, 0.34],
    fogged: false,
    generator: {type: 'sphere', height: 12, radius: 2},
  }
}

var defaults = {
  lit: true,
  fogged: true,
  render: true,
  mergeable: true,
  shader: 'flat'
}

_.forEach(shapes, function (shape) {
  _.defaults(shape, defaults)
})

module.exports = shapes