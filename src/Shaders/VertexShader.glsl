uniform mat4 uNormalMatrix;
uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
attribute vec3 aPos;
attribute vec3 aVertexNormal;
attribute vec2 aTexCoord;
varying vec3 vLighting;
varying vec2 vTexCoord;
void main() {
  // Perform World Translation
  gl_Position = uProjMatrix * uViewMatrix * ( uModelMatrix * vec4( aPos, 1.0 ) );
  // Calculate Ambient And Sun Lighting
  // TODO: This Seems Broken
  highp vec3 ambientLight = vec3(0.5, 0.5, 0.5);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0, 0, 1));

  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
  // TODO: Handle Light Sources
  // Get Texture
  vTexCoord = aTexCoord;
}