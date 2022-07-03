import loadVertexShader from '../Shaders/VertexShader.glsl';
import loadFragmentShader from '../Shaders/FragmentShader.glsl';
import { mat4 } from './gl-matrix/index.js';
import { Mesh } from './Types';
import { radiansToDegrees } from './Utils';
import Vector from './Vector.js';
// Types
export enum RenderType {
  Shaded,
  WireFrame,
}
// Renderer
class Renderer {
  // Public Properties
  public renderType: RenderType;
  public updateFunction: ((deltaTime: number) => void) | undefined;
  public gl: WebGL2RenderingContext;
  public maxDistance = 100;
  // Private Properties
  private textCanvas: HTMLCanvasElement;
  private gameCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private shaderProgram: WebGLProgram;
  private camPosition: Vector = new Vector(0, 0, 0);
  private camDirection: Vector = new Vector(0, 0, 0);
  private lastTime: number;
  private meshes: Mesh[] = [];
  // Shader Attribs
  private uProjMat: WebGLUniformLocation;
  private uViewMat: WebGLUniformLocation;
  private uModelMat: WebGLUniformLocation;
  private uSampler: WebGLUniformLocation;
  private aPos: GLint;
  private aColor: GLint;
  private aTexCoord: GLint;
  // Matrixes
  private projMatrix: mat4;
  private viewMatrix: mat4;
  private modelMatrix: mat4;
  // Textures
  private whiteTexture: WebGLTexture;
  // Constructor
  constructor(
    textCanvas: HTMLCanvasElement,
    gameCanvas: HTMLCanvasElement,
    width: number,
    height: number
  ) {
    // Set Public Properties
    this.renderType = RenderType.Shaded;
    // Set Private Properties
    this.textCanvas = textCanvas;
    this.gameCanvas = gameCanvas;
    this.lastTime = 0;
    // Create The WebGL Context
    const gl = (this.gl = gameCanvas.getContext('webgl2')!);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(121 / 255, 166 / 255, 255 / 255, 1.0);
    // Create The Text Context
    this.ctx = textCanvas.getContext('2d')!;
    // Setup Canvas
    this.setCanvasSize(width, height);
    // Setup Shaders
    const vertexShader = loadVertexShader(gl, gl.VERTEX_SHADER);
    const fragmentShader = loadFragmentShader(gl, gl.FRAGMENT_SHADER);
    const shaderProgram = (this.shaderProgram = this.compileShaders(vertexShader, fragmentShader));
    gl.useProgram(shaderProgram);
    // Get Shader Attributes
    this.uProjMat = gl.getUniformLocation(shaderProgram, 'uProjMatrix')!;
    this.uViewMat = gl.getUniformLocation(shaderProgram, 'uViewMatrix')!;
    this.uModelMat = gl.getUniformLocation(shaderProgram, 'uModelMatrix')!;
    this.uSampler = gl.getUniformLocation(shaderProgram, 'uSampler')!;
    this.aPos = gl.getAttribLocation(shaderProgram, 'aPos');
    this.aColor = gl.getAttribLocation(shaderProgram, 'aColor');
    this.aTexCoord = gl.getAttribLocation(shaderProgram, 'aTexCoord');
    // Enable Attribute Input
    gl.enableVertexAttribArray(this.aPos);
    gl.enableVertexAttribArray(this.aColor);
    gl.enableVertexAttribArray(this.aTexCoord);
    // Setup Matrices
    this.projMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    // Setup Perspective
    this.setPerspective(60, 0.1, 100);
    // TODO: Figure out if we need this
    // Create dummy model matrix
    const modelMatrix = (this.modelMatrix = mat4.create());
    mat4.identity(modelMatrix);
    gl.uniformMatrix4fv(this.uModelMat, false, modelMatrix);
    // Create 1px white texture for pure vertex color operations (e.g. picking)
    const whiteTexture = (this.whiteTexture = gl.createTexture()!);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, whiteTexture);
    const white = new Uint8Array([255, 255, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, white);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.uniform1i(this.uSampler, 0);
    // Start Render Loop
    requestAnimationFrame(this.render.bind(this));
  }
  // Setup Methods
  private setCanvasSize(width: number, height: number) {
    // Set Canvas Size
    this.textCanvas.width = width;
    this.textCanvas.height = height;
    this.gameCanvas.width = width;
    this.gameCanvas.height = height;
  }
  private compileShaders(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const { gl } = this;
    // Create the shader program
    const shaderProgram = gl.createProgram()!;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
      throw `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`;
    }
    // Set The Program To Use This Shader
    return shaderProgram;
  }
  private setPerspective(fov: number, min: number, max: number) {
    const { gl, gameCanvas } = this;
    // Handle Degrees to Radians
    const fovRad = (fov * Math.PI) / 180;
    this.maxDistance = max;
    // Write The Perspective
    mat4.perspective(this.projMatrix, fovRad, gameCanvas.width / gameCanvas.height, min, max);
    gl.uniformMatrix4fv(this.uProjMat, false, this.projMatrix);
  }
  // Render Methods
  private render(currentTime: number) {
    const { gl, updateFunction } = this;
    // Calculate DeltaTime
    currentTime *= 0.001;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;
    // Call Update Function
    if (updateFunction != null) updateFunction.bind(this)(deltaTime);
    // Initialize View
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Render Scene Objects
    for (const mesh of this.meshes) {
      this.drawBuffer(mesh.mesh, mesh.vertexCount);
    }
    // Render Debug Information
    this.renderDebug(deltaTime);
    // Call Next Frame
    requestAnimationFrame(this.render.bind(this));
  }
  // Debug Information
  private renderDebug(deltaTime: number) {
    const { ctx, textCanvas, camPosition, camDirection } = this;
    // Render Debug Text
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    // Render Camera Position
    // console.log(this.camPosition);
    this.renderText(`x: ${camPosition.x}, y: ${camPosition.y}, z: ${camPosition.z}`, 20, 10, 10);
    // Render Camera Direction
    this.renderText(
      `pitch: ${radiansToDegrees(camDirection.x)}, yaw: ${radiansToDegrees(
        camDirection.y
      )}, roll: ${radiansToDegrees(camDirection.z)}`,
      20,
      10,
      40
    );
    // Render Fps
    this.renderText(`fps: ${Math.round(1 / deltaTime)}`, 20, 10, 60);
    // Render Debug Stuff
  }
  // Render Helpers
  public renderText(text: string, textSize: number, x: number, y: number) {
    // Get Properties
    const { ctx } = this;
    // Draw Canvas Text
    ctx.font = `${textSize}px monospace`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
  }
  private drawBuffer(buffer: WebGLBuffer, bufferSize: number) {
    const { gl } = this;
    // Bind Active Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // Define The Matrix Layout
    gl.vertexAttribPointer(this.aPos, 3, gl.FLOAT, false, 9 * 4, 0);
    gl.vertexAttribPointer(this.aColor, 4, gl.FLOAT, false, 9 * 4, 5 * 4);
    gl.vertexAttribPointer(this.aTexCoord, 2, gl.FLOAT, false, 9 * 4, 3 * 4);
    // Draw The Buffer
    switch (this.renderType) {
      case RenderType.Shaded:
        gl.drawArrays(gl.TRIANGLES, 0, bufferSize);
        break;
      case RenderType.WireFrame:
        gl.drawArrays(gl.LINES, 0, bufferSize);
        break;
    }
  }
  // Public Api
  public resize(width: number, height: number) {
    this.setCanvasSize(width, height);
  }
  public setCamera(position: Vector, direction: Vector) {
    const { gl } = this;
    // Set The Camera Position
    this.camPosition = position;
    // Set The Camera Direction
    this.camDirection = direction;
    // Modify The viewMatrix
    mat4.identity(this.viewMatrix);
    mat4.rotate(this.viewMatrix, this.viewMatrix, -direction.x, [1, 0, 0]);
    mat4.rotate(this.viewMatrix, this.viewMatrix, direction.y, [0, 1, 0]);
    mat4.rotate(this.viewMatrix, this.viewMatrix, -direction.z, [0, 0, 1]);
    mat4.translate(this.viewMatrix, this.viewMatrix, position.clone().mulScalar(-1).toArray());
    gl.uniformMatrix4fv(this.uViewMat, false, this.viewMatrix);
  }
  public clearMeshes() {
    this.meshes = [];
  }
  public pushMesh(...meshes: Mesh[]) {
    this.meshes.push(...meshes);
  }
}
// Export The Renderer
export default Renderer;
