module.exports = {
  platform: {
    type: 'extrude', 
    bottom: 1, 
    top: 4,
    mergeable: true
  },

  floor: {
    type: 'extrude', 
    bottom: 0,
    top: 1,
    mergeable: true
  },

  player: {
    type: 'icosphere', 
    height: 6, 
    radius: 2,
    light: true,
    offset: [0, 0, 9]
  },

  bit: {
    type: 'icosphere', 
    height: 5, 
    radius: 0.8
  },

  cue0: {
    type: 'icosphere', 
    height: 12, 
    radius: 2.5,
    light: true,
    offset: [0, 0, 5]
  },

  cue1: {
    type: 'icosphere',
    height: 12, 
    radius: 2.5,
    light: true,
    offset: [0, 0, 5]
  },

  cue2: {
    type: 'icosphere', 
    height: 12, 
    radius: 2.5,
    light: true,
    offset: [0, 0, 5]
  },

  cue3: {
    type: 'icosphere', 
    height: 12, 
    radius: 2.5,
    light: true,
    offset: [0, 0, 5]
  }
}