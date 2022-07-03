/// <reference types="vite/client" />
declare module '*.glsl' {
  const loadShader: (gl: WebGLRenderingContext, type: GLenum) => WebGLShader;
  export default loadShader;
}