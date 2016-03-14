module.exports = {
  '.platform': {
    emissive: [0.05, 0.05, 0.05],
    ambient: [0.1, 0.1, 0.1],
    diffuse: [0.4, 0.4, 0.4]
  },

  '.floor': {
    emissive: [0.05, 0.05, 0.05],
    ambient: [0.05, 0.05, 0.05],
    diffuse: [0.2, 0.2, 0.2]
  },

  '#player': {
    emissive: [0.4, 0.4, 0.4],
    diffuse: [0.9, 0.9, 0.9]
  },

  '.bit': {
    emissive: [0.1, 0.1, 0.1],
    diffuse: [1.5, 1.5, 1.5],
    ambient: [0.1, 0.1, 0.1]
  },

  '.cue-0': {
    emissive: [0.87, 0.52, 0.23],
    diffuse: [0.1, 0.1, 0.1],
    fogged: false
  },

  '.cue-1': {
    emissive: [0.00, 0.76, 0.93],
    diffuse: [0.1, 0.1, 0.1],
    fogged: false
  },

  '.cue-2': {
    emissive: [0.51, 0.79, 0.29],
    diffuse: [0.1, 0.1, 0.1],
    fogged: false
  },

  '.cue-3': {
    emissive: [0.81, 0.33, 0.34],
    diffuse: [0.1, 0.1, 0.1],
    fogged: false
  },

  '.cue-0-light': {
    color: [0.87, 0.52, 0.23],
    intensity: 0,
    ambient: 0,
    radius: 35
  },

  '.cue-1-light': {
    color: [0.00, 0.76, 0.93],
    intensity: 0,
    ambient: 0,
    radius: 35
  },

  '.cue-2-light': {
    color: [0.51, 0.79, 0.29],
    intensity: 0,
    ambient: 0,
    radius: 35
  },

  '.cue-3-light': {
    color: [0.81, 0.33, 0.34],
    intensity: 0,
    ambient: 0,
    radius: 35
  },

  '.player-light': {
    color: [1, 1, 1],
    intensity: 2,
    radius: 50,
    ambient: 0.5
  },

  '.active': {
    intensity: 12
  },

  '.inactive': {
  }
}