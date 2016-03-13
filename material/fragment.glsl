precision highp float;

varying vec3 vposition;
varying vec3 vnormal;
uniform vec3 eye;

#pragma glslify: Light = require('glsl-light')
#pragma glslify: attenuation = require('glsl-light-attenuation')
#pragma glslify: direction = require('glsl-light-direction')
#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: fog = require('glsl-fog')

struct Style {
  vec3 emissive;
  vec3 ambient;
  vec3 diffuse;
  bool fogged;
};

uniform Light lighting[LIGHTCOUNT];
uniform Style style;

void main() {
  vec3 viewpoint = eye - vposition;
  vec3 result = vec3(0.0);

  for (int i = 0; i < LIGHTCOUNT; ++i) {
    if (lighting[i].visible) {
      vec3 ambient = lighting[i].ambient * style.ambient;
      result += ambient;
    }
  }

  result = result + style.emissive;
  if (style.fogged) result = mix(result, vec3(0.05, 0.05, 0.05), fog(length(viewpoint), 0.01));

  for (int i = 0; i < LIGHTCOUNT; ++i) {
    if (lighting[i].visible) {
      vec3 dir = direction(lighting[i], vposition);
      float attn = attenuation(lighting[i], dir);
      float diffuse = orenn(normalize(dir), normalize(viewpoint), vnormal, 0.7, 0.7);
      diffuse = ( diffuse < 0.0 || 0.0 < diffuse || diffuse == 0.0 ) ? diffuse : 0.0;
      vec3 combined = diffuse * style.diffuse;
      result += attn * combined * lighting[i].color * lighting[i].intensity;
    }
  }
  
  gl_FragColor = vec4(result, 1);
}