# hexaworld-renderer-3d

Render hexaworld games using [`stack.gl`](http://stack.gl). Composes with [`hexaworld-core`](https://github.com/hexaworld/hexaworld-core) to make a fully rendered and playable game.

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

### install

Currently in development and not yet published to `npm`. To try it out, first `git clone` [`hexaworld-core`](https://github.com/hexaworld/hexaworld-core) and call

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
This renderer is composed from two primary components.

#### `view` 
(NOTE: this is mainly for debugging purposes and can be dropped in the future)

Simple wrapper for different `stack.gl` cameras.

- `view.type` Type of camera.

- `view.camera` The camera itself.

#### `scene`

(NOTE: this is very general and might make one or more nice standalone `stack.gl` modules)

Builds a collection of `stack.gl` geometries and light sources from a list of `objects`, and enables updating them (through events like `remove` and `move`) and drawing them to the `gl` context.

To initialize a scene, just pass a `gl` context.

```javascript
var scene = Scene(gl)
```

##### methods

- `scene.build(objects, styles)` Build a scene from a list of `objects` and  `styles`. Every object in the list should have the following attributes:

```javascript
{
	id: 'string',
	type: 'string',
	points: [[x, y], [x, y], ...]
	transform: {translation: [x, y], scale: s, rotation: r}
}
```

And styles should map `type`s to properties, in the form:

```javascript
{
	shapes: {type0: {}, type1: {},	...},
	lights: {type0: {}, type1: {},	...}
}
```

- `scene.update(view)` Update rendering matrices using the provided `view`.

- `scene.draw()` Draw the scene.

- `scene.move(id, transform)` Move the geometry with the given `id` using the given `transform`.

- `scene.remove(id)` Remove the geometry with the given `id` from the scene.

- `scene.find(id)` Return the geometry with the given `id`.

### styling

When building a scene, the following styles can be used to easily set attributes on all rendered geometries.

#### `shapes`
Schema for shape attributes, e.g.

```javascript
color: [0.1, 0.4, 0.2] // material color
lit: true, // whether to apply lights
fog: true, // whether to apply fog
hide: true, // whether to hide
render: true, // whether to render
mergeable: true, // whether geometries of this type can be combined
shader: 'flat', // which shader to use
generator: {type: 'extrude', bottom: 0, height: 45} // how to construct 3d geometry from point(s)
```

#### `lights`
Schema for light attributes
```javascript
color: [0.9, 0.1, 0.5] // light color
height: 50 // height of light
```
