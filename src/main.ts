// Import Scss
import './style.scss';
// Imports
// import loadVertexShader from './Shaders/VertexShader.glsl';
// import loadFragmentShader from './Shaders/FragmentShader.glsl';
// import Renderer, { RenderType } from './Engine/Renderer';
// import Controller from './Engine/Controller';
// import World from './Engine/World/World';
// import Vector from './Engine/Vector';
// import MeshMapper from './Meshes/index';
// import { clamp, degreesToRadians } from './Engine/Utils';
// // Get Canvas
// const canvas = <HTMLCanvasElement>document.getElementById('gameView')!;
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// const gl = <WebGL2RenderingContext | null>canvas.getContext('webgl2');
// if (gl == null) {
//   alert('Unable to initialize WebGL. Your browser or machine may not support it.');
//   throw 'Unable to initialize WebGL. Your browser or machine may not support it.';
// }
// // Load Shaders
// const vertexShader = loadVertexShader(gl, gl.VERTEX_SHADER);
// const fragmentShader = loadFragmentShader(gl, gl.FRAGMENT_SHADER);
// // Create Text Renderer
// const textCanvas = document.createElement('canvas');
// textCanvas.width = window.innerWidth;
// textCanvas.height = window.innerHeight;
// document.body.appendChild(textCanvas);
// const ctx = textCanvas.getContext('2d');
// if (ctx == null) {
//   alert('Unable to initialize 2dContext.');
//   throw 'Unable to initialize 2dContext.';
// }
// // Handle Resize
// window.onresize = () => {
//   canvas.width = window.innerWidth;
//   canvas.height = window.innerHeight;
//   textCanvas.width = window.innerWidth;
//   textCanvas.height = window.innerHeight;
// };
// // Start Renderer
// const renderer = new Renderer(ctx, gl, vertexShader, fragmentShader);
// const controller = new Controller(document);
// // Render world
// const meshMapper = MeshMapper(gl);
// // Setup Update Loop
// renderer.setUpdate((deltaTime: number) => {
//   // Check Keys
//   const fAxis = controller.forwardAxis;
//   const sAxis = controller.sideAxis;
//   const dir = renderer.cameraDirection;
//   // Basic Look Script
//   if (controller.keys.get('ArrowUp')) dir.x += degreesToRadians(deltaTime * 75);
//   if (controller.keys.get('ArrowDown')) dir.x -= degreesToRadians(deltaTime * 75);
//   if (controller.keys.get('ArrowLeft')) dir.y += degreesToRadians(deltaTime * 75);
//   if (controller.keys.get('ArrowRight')) dir.y -= degreesToRadians(deltaTime * 75);
//   // Debug Controls
//   if (controller.keys.get('KeyE')) {
//     if (renderer.renderType == RenderType.Shaded) {
//       renderer.renderType = RenderType.WireFrame;
//     } else {
//       renderer.renderType = RenderType.Shaded;
//     }
//   }
//   //  Constrain Look
//   dir.x = clamp(dir.x, -Math.PI / 2, Math.PI / 2);
//   // Apply Look
//   renderer.cameraDirection.copy(dir);
//   // Handle Camera Movement
//   const dirVec = new Vector(Math.sin(dir.y), 0, Math.cos(dir.y));
//   const velocity = new Vector(
//     -fAxis * dirVec.x + sAxis * dirVec.z,
//     0,
//     -fAxis * dirVec.z + sAxis * -dirVec.x
//   );
//   if (controller.jumpButton) velocity.y += 1;
//   else if (controller.crouchButton) velocity.y -= 1;
//   // Multiply Velocity By Speed
//   velocity.mulScalar(deltaTime * 30);
//   // TODO: Physics
//   // Apply Movement
//   renderer.cameraPosition.addVector(velocity);
//   // Render World
//   const worldMesh = world.render(gl, renderer.cameraPosition, meshMapper);
//   renderer.clearMeshes();
//   renderer.addMeshes(worldMesh);
// });

import Renderer, { RenderType } from './Engine/Renderer';
import Controller from './Engine/Controller';
import World from './Engine/World/World';
import Vector from './Engine/Vector';
import { clamp, degreesToRadians } from './Engine/Utils';
const gameView = <HTMLCanvasElement>document.getElementById('gameView')!;
const textView = <HTMLCanvasElement>document.getElementById('textView')!;
const renderer = new Renderer(textView, gameView, window.innerWidth, window.innerHeight);
// handle screen resize
window.onresize = () => renderer.resize(window.innerWidth, window.innerHeight);
// Handle Update Function
const controller = new Controller(document);
// Create World
const world = new World(0);
// Setup Update Loop
const playerPosition = new Vector(0, 2, 0);
const playerDirection = new Vector(0, 0, 0);
renderer.updateFunction = (deltaTime: number) => {
  // Check Keys
  const fAxis = controller.forwardAxis;
  const sAxis = controller.sideAxis;
  // Basic Look Script
  if (controller.keys.get('ArrowUp')) playerDirection.x += degreesToRadians(deltaTime * 75);
  if (controller.keys.get('ArrowDown')) playerDirection.x -= degreesToRadians(deltaTime * 75);
  if (controller.keys.get('ArrowRight')) playerDirection.y += degreesToRadians(deltaTime * 75);
  if (controller.keys.get('ArrowLeft')) playerDirection.y -= degreesToRadians(deltaTime * 75);
  // Debug Controls
  if (controller.keys.get('KeyE')) {
    if (renderer.renderType == RenderType.Shaded) {
      renderer.renderType = RenderType.WireFrame;
    } else {
      renderer.renderType = RenderType.Shaded;
    }
  }
  //  Constrain Look
  playerDirection.x = clamp(playerDirection.x, -Math.PI / 2, Math.PI / 2);
  // Handle Camera Movement
  const dirVec = new Vector(Math.cos(playerDirection.y), 0, Math.sin(playerDirection.y));
  const velocity = new Vector(
    fAxis * dirVec.z + sAxis * dirVec.x,
    0,
    fAxis * -dirVec.x + sAxis * dirVec.z
  );
  if (controller.jumpButton) velocity.y += 1;
  else if (controller.crouchButton) velocity.y -= 1;
  // Multiply Velocity By Speed
  velocity.mulScalar(deltaTime * 15);
  // TODO: Physics
  // Set Camera
  renderer.setCamera(playerPosition.addVector(velocity), playerDirection);
  // Update World
  const worldMesh = world.render(renderer, playerPosition);
  // Push The New Meshes To The Renderer
  renderer.clearMeshes();
  renderer.pushMesh(...worldMesh);
};
