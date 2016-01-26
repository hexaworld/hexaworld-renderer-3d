# hexaworld-renderer-3d

Renderer for hexaworld games that uses stack.gl. Composes with `hexaworld-core` to make a fully rendered and playable game. The gameplay logic of `hexaworld-core` is 2d, but this modules renders the world with 3d graphics. 

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### example

First construct a `game` using `hexaworld-core`, which just requires a valid `gameloop`, `controller`, and level `schema`. The renderer on the `gameloop` should be a valid `webgl` context.

```javascript

var gameloop = require('gameloop')({renderer: gl})
var controller = require('crtrdg-keyboard')(gameloop)

var game = require('hexaworld-core')({
  schema: schema,
  gameloop: gameloop, 
  controller: controller
})
```

then create the hexaworld renderer

```javascript
var renderer = require('hexaworld-renderer-3d')(game, gl)
```

and when you start the `gameloop` the game will begin.

```javascript
gameloop.start()
```

### inputs

#### `gl`
A `webgl` context.

#### `game`
A valid `hexaworld-core` game. Two attributes of the game are used by the renderer:

- `game.objects` A list of all objects defined by the game, each of which has a `type`, `id`, and `transform`. 

- `game.events` Events from the game that are used to dynamically update the rendered scene (see `hexaworld-core` for all events).

### components

This renderer is built out of two primary components, each of which are quite general and could possibly be moved to separate repos within the `stack.gl` ecosystem. 

- `view` Simple wrapper for different `stack.gl` cameras.

- `view.type` Type of camera.

##### `view.camera`
The camera itself.

#### `scene`
Enables building a collection of `stack.gl` geometries and light sources from a list of `objects`, and setting geometries given the current state of all objects on each update, and drawing them to the context.

- `scene.build(objects, styles)` Build a scene from a list of `objects` and  `styles`. Every object in the list should have the following attributes:

```javascript
{
	id: 'id',
	type: 'type',
	transform: {translation: [5, 1], rotation: 90, scale: 2}
}
```

And styles should map `types` to properties, for both `shapes` and `lights`, in the form:

```javascript
{
	shapes: {
		type: {}
	},
	lights: {
		type: {}
	}
}
```

- `scene.update(view)` Update any geometries and cameras using the current view and object states.

- `scene.draw(gl, view)` Draw the scene using the given `gl` context and `view`.

- `scene.remove(id)` Remove the geometry with the given `id` from the scene.

### styling

#### `shapes`
Schema for shape attributes, e.g.

```javascript
color: [0.1, 0.4, 0.2]
lit: true,
fogged: true,
render: true,
mergeable: true,
shader: 'flat',
generator: {type: 'sphere', radius: 5, height: 45}
```

#### `lights`
Schema for light attributes
```javascript
color: [0.9, 0.1, 0.5]
height: 50
```
