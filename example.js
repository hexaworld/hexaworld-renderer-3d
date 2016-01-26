var fastclick = require('fastclick').FastClick
fastclick.attach(document.body)

var config = {
  moves: 6
}

var map = {
  tiles: [
    {coordinates: [0, 0], paths: [0, 2, 4], cue: {id: 0}},
    {coordinates: [-1, 0], paths: [0, 4, 5], cue: {id: 1}},
    {coordinates: [0, 1], paths: [2, 3, 4]},
    {coordinates: [-1, 1], paths: [4, 5], cue: {id: 2}},
    {coordinates: [1, -1], paths: [2, 3]},
    {coordinates: [1, 0], paths: [1, 3]},
    {coordinates: [0, -1], paths: [1, 3, 5]},
    {coordinates: [0, -2], paths: [0, 5]},
    {coordinates: [1, -2], paths: [0, 2], cue: {id: 3}}
  ]
}

var schema = {
  config: config,
  map: map
}

var container = document.getElementById('container')
var canvas = document.createElement('canvas')
canvas.height = container.clientHeight
canvas.width = container.clientWidth
var gl = canvas.getContext('webgl')
container.appendChild(canvas)

var gameloop = require('gameloop')({
  canvas: canvas,
  renderer: gl
})

var controller = require('crtrdg-keyboard')(gameloop)

var game = require('hexaworld-core')({
  schema: schema,
  gameloop: gameloop, 
  controller: controller
})

var renderer = require('hexaworld-3d')(game, gl)

gameloop.start()
