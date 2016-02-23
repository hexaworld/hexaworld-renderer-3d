precision highp float;

varying vec3 vposition;
varying vec3 vnormal;

uniform float lit;
uniform float fog;
uniform vec3 eye;
uniform vec3 color;
uniform vec3 lpositionv[LIGHTCOUNT];
uniform vec3 lcolorv[LIGHTCOUNT];
uniform float lbrightv[LIGHTCOUNT];
uniform float ldecayv[LIGHTCOUNT];

#pragma glslify: orenn = require('glsl-diffuse-oren-nayar')
#pragma glslify: fogger = require('glsl-fog')

float attenuation(float lightDistance, float cutoffDistance, float decayExponent) {
  if (decayExponent > 0.0) {
    return pow(clamp(-lightDistance / cutoffDistance + 1.0, 0.0, 1.0), decayExponent);
  }
  return 1.0;
}

void main() {

	vec3 viewdiff = eye - vposition;
	vec3 material = color;
	vec3 result = color;

	vec3 ldiff;
	vec3 lcolor;
	float lbright;
	float ldecay;
	float diff;
	float attn;
	
	result = (fog > 0.0) ? mix(result, vec3(0.0392, 0.0392, 0.0392), fogger(length(viewdiff), 0.01)) :  result;

	for (int i = 0; i < LIGHTCOUNT; i++) { 
		ldiff = lpositionv[i] - vposition;
		lcolor = lcolorv[i];
		lbright = lbrightv[i];
		ldecay = ldecayv[i];
		diff = orenn(normalize(ldiff), normalize(viewdiff), vnormal, 0.9, 0.9);
		attn = attenuation(length(ldiff), ldecay, 1.1);
		result = (lit > 0.0) ? (result + lbright * attn * diff * lcolor * material) :  result;
	}

 	gl_FragColor = vec4(result, 1);
}