var glslify = require('glslify')

module.exports = {
  fragment: glslify('./fragment.glsl'),
  styles: {
    emissive: {type: 'vec3', default: [0.0, 0.0, 0.0]},
    ambient: {type: 'vec3', default: [0.2, 0.2, 0.2]},
    diffuse: {type: 'vec3', default: [0.8, 0.8, 0.8]},
    fogged: {type: 'bool', default: true}
  },
  name: 'foggy'
}
