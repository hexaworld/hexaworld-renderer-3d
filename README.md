# hexaworld-renderer-3d

Render hexaworld games using [`stack.gl`](http://stack.gl). Composes with `hexaworld-core` to make a fully rendered and playable game. The gameplay logic of `hexaworld-core` is 2d, but this module renders the world with 3d graphics. 

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### install

Currently in development and not yet published to `npm`. To try it out, first `git clone` [`hexaworld-core`](https://github.com/hexaworld/hexaworld-core) and from inside its folder call

```
npm link
```

then `git clone` this repo and start a demo by calling

```
npm link hexaworld-core
npm start
```

### example

First construct a `game` using `hexaworld-core`, which just requires a valid level `schema` and `controller`.

```javascript

var controller = require('crtrdg-keyboard')()
var core = require('hexaworld-core')

var game = core({schema: schema, controller: controller})
```

then create the hexaworld 3d renderer

```javascript
var renderer = require('hexaworld-renderer-3d')({game: game, gl: gl})
```

when you start the `game` the rendering will begin.

```javascript
game.start()
```

### inputs

#### `game`
A valid `hexaworld-core` game. The renderer uses `game.objects`, which is a list of all objects defined by the game, each of which has `type`, `id`, `points`, and `transform`. It also uses the events exposed by the game.

#### `gl`
A `webgl` context.

### components
This renderer is built out of two primary components, each of which are quite general and could probably be refactored and/or moved to separate repos within the `stack.gl` ecosystem. 

#### `view` 
Simple wrapper for different `stack.gl` cameras.

- `view.type` Type of camera.

- `view.camera` The camera itself.

#### `scene`
Builds a collection of `stack.gl` geometries and light sources from a list of `objects`, and enables updating them (through `remove` and `move` events) and drawing them to the `gl` context.

- `scene.build(objects, styles)` Build a scene from a list of `objects` and  `styles`. Every object in the list should have the following attributes:

```javascript
{
	id: 'string',
	type: 'string',
	points: [[x, y], [x, y], ...]
	transform: {translation: [x, y], scale: s, rotation: r}
}
```

And styles should map `type` to a sett of properties, for both `shapes` and `lights`, in the form (see below for more details):

```javascript
{
	shapes: {
		type0: {},
		type1: {},
		...
	},
	lights: {
		type0: {},
		type1: {},
		...
	}
}
```

- `scene.update(view)` Update rendering matries using the provided `view`.

- `scene.draw(gl)` Draw the scene using the given `gl` context and `view`.

- `scene.move(id, transform)` Move the geometry with the given `id` using `transform`.

- `scene.remove(id)` Remove the geometry with the given `id` from the scene.

- `scene.find(id)` Return the geometry with the given `id`.

### styling

When building a scene, the following styles can be used to easily set attributes on all rendered geometries.

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
