// Import Scss
import './style.scss';
import terrainTextureSrc from './Engine/terrain.png';
// Imports
import Renderer, { RenderType } from './Engine/Renderer';
import Controller from './Engine/Controller';
import World from './Engine/World/World';
import { clamp, degreesToRadians } from './Engine/Utils';
import { vec3 } from './Engine/gl-matrix/index';
// Get canvases
const gameView = <HTMLCanvasElement>document.getElementById('gameView')!;
const textView = <HTMLCanvasElement>document.getElementById('textView')!;
// Create Texture
const terrainTexture = new Image();
terrainTexture.src = terrainTextureSrc;
// Create Renderer
const renderer = new Renderer(
  textView,
  gameView,
  terrainTexture,
  window.innerWidth,
  window.innerHeight
);
// handle screen resize
window.onresize = () => renderer.resize(window.innerWidth, window.innerHeight);
// Handle Update Function
const controller = new Controller(document);
// Create World
const world = new World(1);
// Setup Update Loop
const playerPosition = vec3.clone(world.worldSpawn);
playerPosition[1] += 2; // Add Player Height
const playerDirection = vec3.create();
renderer.updateFunction = (deltaTime: number) => {
  // Check Keys
  const fAxis = controller.forwardAxis;
  const sAxis = controller.sideAxis;
  // Basic Look Script
  if (controller.keys.get('ArrowUp')) playerDirection[0] += degreesToRadians(deltaTime * 75);
  if (controller.keys.get('ArrowDown')) playerDirection[0] -= degreesToRadians(deltaTime * 75);
  if (controller.keys.get('ArrowRight')) playerDirection[1] += degreesToRadians(deltaTime * 75);
  if (controller.keys.get('ArrowLeft')) playerDirection[1] -= degreesToRadians(deltaTime * 75);
  // Debug Controls
  if (controller.keys.get('KeyE')) {
    if (renderer.renderType == RenderType.Shaded) {
      renderer.renderType = RenderType.WireFrame;
    } else {
      renderer.renderType = RenderType.Shaded;
    }
  }
  //  Constrain Look
  playerDirection[0] = clamp(playerDirection[0], -Math.PI / 2, Math.PI / 2);
  // Handle Camera Movement
  const dirVec = vec3.fromValues(Math.cos(playerDirection[1]), 0, Math.sin(playerDirection[1]));
  const velocity = vec3.fromValues(
    fAxis * dirVec[2] + sAxis * dirVec[0],
    0,
    fAxis * -dirVec[0] + sAxis * dirVec[2]
  );
  if (controller.jumpButton) velocity[1] += 1;
  else if (controller.crouchButton) velocity[1] -= 1;
  // Multiply Velocity By Speed
  if (controller.keys.get('ShiftLeft')) vec3.scale(velocity, velocity, deltaTime * 120);
  else vec3.scale(velocity, velocity, deltaTime * 15);
  // Apply Velocity
  vec3.add(playerPosition, playerPosition, velocity);
  // TODO: Physics
  // Update World
  world.updateWorld(deltaTime, playerPosition);
  // Set Camera
  renderer.setCamera(playerPosition, playerDirection);
  // Update World
  const worldMesh = world.render(renderer, playerPosition, playerDirection);
  // Push The New Meshes To The Renderer
  renderer.clearMeshes();
  renderer.pushMesh(...worldMesh);
};
