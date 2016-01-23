var fastclick = require('fastclick').FastClick
fastclick.attach(document.body)

var config = {
  moves: 6
}

var map = {
  tiles: [
    {coordinates: [0, 0], paths: [0, 2, 4]},
    {coordinates: [-1, 0], paths: [0, 2, 4]},
    {coordinates: [0, 1], paths: [0, 2, 4]}
  ]
}

var schema = {
  config: config,
  map: map
}

var container = document.getElementById('container')
var canvas = document.createElement('canvas')
var gl = canvas.getContext('webgl')
canvas.height = container.clientHeight
canvas.width = container.clientHeight
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

// gameloop.on('update', function (interval) {
//   console.log(game.objects[0].transform.translation)
// })