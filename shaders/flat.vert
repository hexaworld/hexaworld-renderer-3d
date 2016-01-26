precision highp float;

attribute vec3 position;
attribute vec3 normal;

uniform mat4 proj;
uniform mat4 view;
uniform mat4 move;

varying vec3 vposition;
varying vec3 vnormal;

void main() {
	vposition = (move * vec4(position, 1.0)).xyz;
	vnormal = normalize(normal);
 	gl_Position = proj * view * move * vec4(position, 1.0);
}