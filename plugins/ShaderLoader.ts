const fileRegex = /\.(glsl)$/;

export default function ShaderLoader() {
  return {
    name: 'ShaderLoader',

    transform(src: string, id: string) {
      if (fileRegex.test(id)) {
        // Build Code
        const code = [
          'export default (gl, type) => {',
          '  // Create Shader',
          '  const shader = gl.createShader(type);',
          `  gl.shaderSource(shader, '${src.replace(/(\n|\/\/.*$)/gm, '')}');`,
          '  gl.compileShader(shader);',
          '  // Check Compilation was Succesful',
          '  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {',
          '    gl.deleteShader(shader);',
          '    throw `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`',
          '  }',
          '  // Return Shader',
          '  return shader;',
          '}',
        ].join('\n');
        // Return Code
        return {
          code: code,
          map: null,
        };
      }
    },
  };
}
