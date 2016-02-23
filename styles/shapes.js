var shapes = {
  platform: {
    color: [0.3, 0.3, 0.3]
  },

  floor: {
    color: [0.2, 0.2, 0.2],
    lit: false
  },

  player: {
    color: [0.7, 0.7, 0.7],
    fog: false
  },

  bit: {
    color: [0.9, 0.9, 0.9],
    hide: true,
  },

  cue0: {
    color: [0.87, 0.52, 0.23],
    fog: false
  },

  cue1: {
    color: [0.00, 0.76, 0.93],
    fog: false
  },

  cue2: {
    color: [0.51, 0.79, 0.29],
    fog: false
  },

  cue3: {
    color: [0.81, 0.33, 0.34],
    fog: false
  }
}

var defaults = {
  lit: true,
  fog: true,
  hide: false
}

_.forEach(shapes, function (shape) {
  _.defaults(shape, defaults)
})

module.exports = shapes