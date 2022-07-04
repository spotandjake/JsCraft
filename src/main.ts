// Import Scss
import './style.scss';
import terrainTextureSrc from './Engine/terrain.png';
// Imports
import Renderer, { RenderType } from './Engine/Renderer';
import Controller from './Engine/Controller';
import World from './Engine/World/World';
import Vector from './Engine/Vector';
import { clamp, degreesToRadians } from './Engine/Utils';
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
  if (controller.keys.get('ShiftLeft')) velocity.mulScalar(deltaTime * 120);
  else velocity.mulScalar(deltaTime * 15);
  // TODO: Physics
  // Set Camera
  renderer.setCamera(playerPosition.addVector(velocity), playerDirection);
  // Update World
  const worldMesh = world.render(renderer, playerPosition);
  // Push The New Meshes To The Renderer
  renderer.clearMeshes();
  renderer.pushMesh(...worldMesh);
};
