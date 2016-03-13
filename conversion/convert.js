var mat4 = require('gl-mat4')
var unindex = require('unindex-mesh')
var reindex = require('mesh-reindex')
var combine = require('mesh-combine')
var extrude = require('extrude')
var icosphere = require('icosphere')
var camel = require('camelcase')
var config = require('./generators.js')

function extractShapes (sources) {
  var shapes = []

  sources.forEach(function (object) {
    var opts = config[camel(object.type)]

    var scale, position, complex, t

    if (opts.type == 'extrude') {
      complex = extrude(object.points, {top: opts.top, bottom: opts.bottom})
      position = [0, 0, 0]
    }

    if (opts.type == 'triangle') {
      complex = extrude([[0, 1], [-0.5, -1], [0.5, -1]], {top: opts.top, bottom: opts.bottom})
      t = object.transform.translation
      position = [t[0], t[1], opts.height || 0]
      scale = [2, 3, 1]
    }

    if (opts.type == 'icosphere') {
      complex = icosphere(0)
      complex.positions = complex.positions.map(function (p) {
        return [p[0] * opts.radius, p[1] * opts.radius, p[2] * opts.radius]
      })
      t = object.transform.translation
      position = [t[0], t[1], opts.height || 0]
    }

    shapes.push({
      complex: complex,
      position: position,
      scale: scale,
      id: object.id,
      className: object.type,
      type: object.type,
      material: 'foggy'
    })
  })

  var types = _.uniq(_.map(shapes, 'type'))
  _.forEach(types, function (type) {
    var filtered = _.filter(shapes, ['type', type])
    var mergeable = config[camel(type)].mergeable
    var canmerge = mergeable & filtered.length > 1
    if (canmerge) {
      var combined = combine(_.map(filtered, 'complex'))
      var merged = {
        complex: combined, 
        id: 'merged: ' + filtered[0].type,
        className: filtered[0].type
      }
      _.defaults(merged, filtered[0])
      _.remove(shapes, ['type', type])
      shapes.push(merged)
    }
  })

  shapes.forEach(function (object) {
    object.complex = reindex(unindex(object.complex.positions, object.complex.cells))
  })

  return shapes
}

function extractLights (sources) {
  var lights = []

  sources.forEach(function (object) {
    var opts = config[camel(object.type)]

    if (opts.light) {
      var t = object.transform.translation
      var o = opts.offset || [0, 0, 0]
      var position = [t[0] + o[0], t[1] + o[1], (opts.height || 0) + o[2]]

      lights.push({
        id: object.id + '-light',
        className: object.type + '-light',
        position: position
      })
    }
  })

  return lights
}

module.exports = {
  shapes: extractShapes,
  lights: extractLights
}