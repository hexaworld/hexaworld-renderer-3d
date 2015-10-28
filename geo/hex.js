var _ = require('lodash')
var Geometry = require('../geometry.js')

module.exports = function (opts) {
  opts = opts || {}

  return new Geometry({
    props: {
      fill: opts.fill || '#DFE0E2',
      stroke: opts.stroke || '#DFE0E2',
      type: 'polygon'
    },

    shape: _.range(7).map(function(i) {
      var dx =  Math.cos(i * 2 * Math.PI / 6)
      var dy =  Math.sin(i * 2 * Math.PI / 6)
      return [dx, dy]
    }),

    transform: {
      scale: opts.scale
    },

    children: opts.children
  })

} 