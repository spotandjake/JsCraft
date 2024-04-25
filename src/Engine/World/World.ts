import { vec3 } from '../gl-matrix/index';
import Chunk from './Chunk';
import Block from './Block';
import { BlockType } from '../Types';
import type { Mesh } from '../Types';
import type Renderer from '../Renderer';
import Noise from './perlin';
class World {
  // Internal Storage
  private seed: number;
  private worldChunks: Map<string, Chunk>;
  private playerPosition: vec3 = vec3.create();
  public worldSpawn: vec3 = vec3.fromValues(0, 0, 0);
  private chunkSize = 16;
  private renderDistance: number;
  private loadDistance: number;
  private noise: Noise;
  public renderQueue: Chunk[] = [];
  private maxTerrainHeight = 1000;
  // Optimal loadArea = 8
  // Optimal LoadDistance = 8
  constructor(seed: number, renderDistance = 8, loadDistance = 10) {
    // If The Seed is 0 then we are using a flat world
    this.seed = seed;
    this.renderDistance = renderDistance;
    this.loadDistance = loadDistance;
    // Initialize The World Array
    this.worldChunks = new Map();
    // Initialize Noise Generator
    this.noise = new Noise(seed);
    // PreInitialize The World
    for (let x = -loadDistance; x < loadDistance; x++) {
      for (let y = -loadDistance; y < loadDistance; y++) {
        for (let z = -loadDistance; z < loadDistance; z++) {
          // Calculate The X And Z Coordinates
          const chunkPosition = this.getChunkCoordinates(
            this.worldSpawn[0],
            this.worldSpawn[1],
            this.worldSpawn[2]
          );
          this.generateChunk(chunkPosition[0] + x, chunkPosition[1] + y, chunkPosition[2] + z);
        }
      }
    }
    // Find Spawn Height
    this.worldSpawn[1] = this.maxTerrainHeight;
    while (this.worldSpawn[1] > -1000) {
      // If The Block Below Us Is Solid Set Spawn Point
      if (
        this.getBlock(this.worldSpawn[0], --this.worldSpawn[1], this.worldSpawn[2]).blockType !==
        BlockType.Air
      )
        break;
    }
  }
  // Internal Helpers
  private serializeChunkCords(x: number, y: number, z: number) {
    return `${x} ${y} ${z}`;
  }
  private getBlockChunk(x: number, y: number, z: number): Chunk | undefined {
    const chunkPosition = this.getChunkCoordinates(x, y, z);
    // Get The Chunk
    const chunk = this.worldChunks.get(
      this.serializeChunkCords(chunkPosition[0], chunkPosition[1], chunkPosition[2])
    );
    // Return The Chunk
    return chunk;
  }
  private getChunkCoordinates(x: number, y: number, z: number) {
    const chunkX = x > 0 ? Math.ceil(x / this.chunkSize) : Math.floor(x / this.chunkSize);
    const chunkY = y > 0 ? Math.ceil(y / this.chunkSize) : Math.floor(y / this.chunkSize);
    const chunkZ = z > 0 ? Math.ceil(z / this.chunkSize) : Math.floor(z / this.chunkSize);
    return vec3.fromValues(chunkX, chunkY, chunkZ);
  }
  private getBlockCoordinates(x: number, y: number, z: number) {
    // TODO: I dont think this is correct
    return vec3.fromValues(
      x < 0 ? this.chunkSize + (x % this.chunkSize) : Math.abs(x % this.chunkSize),
      y < 0 ? this.chunkSize + (y % this.chunkSize) : Math.abs(y % this.chunkSize),
      z < 0 ? this.chunkSize + (z % this.chunkSize) : Math.abs(z % this.chunkSize)
    );
  }
  // Safe Chunk Elements Manipulation
  private setChunk(x: number, y: number, z: number, chunk: Chunk) {
    // Set The Chunk
    this.worldChunks.set(this.serializeChunkCords(x, y, z), chunk);
  }
  public getChunk(x: number, y: number, z: number): Chunk {
    // Get The Chunk
    const chunk = this.worldChunks.get(this.serializeChunkCords(x, y, z));
    // If it doesn't exist generate it
    if (chunk === undefined) {
      return this.generateChunk(x, y, z);
    } else {
      return chunk;
    }
  }
  // Generate World
  private generateChunk(x: number, y: number, z: number) {
    // TODO: Consider moving this into a shader running on a background canvas, disadvantage is we lose portability
    const chunkSize = this.chunkSize;
    const noise = this.noise;
    const seaLevel = -15;
    const worldX = x * chunkSize;
    const worldY = y * chunkSize;
    const worldZ = z * chunkSize;
    // Create A New Chunk
    const chunk = new Chunk(this.chunkSize, worldX, worldY, worldZ);
    // If The Seed is 0 then Generate Flat World
    if (this.seed == 0) {
      let offsetX = 0,
        offsetY = 0,
        offsetZ = 0;
      for (offsetZ = 0; offsetZ < chunkSize; offsetZ++) {
        for (offsetY = 0; offsetY < chunkSize; offsetY++) {
          for (offsetX = 0; offsetX < chunkSize; offsetX++) {
            // Calculate world Cords
            const blockX = offsetX + worldX;
            const blockY = offsetY + worldY;
            const blockZ = offsetZ + worldZ;
            // Conditions For Flat World
            if (blockY < 1) {
              chunk.setBlock(
                offsetX,
                offsetY,
                offsetZ,
                new Block(blockX, blockY, blockZ, BlockType.Grass)
              );
            }
          }
        }
      }
    } else {
      let offsetX = 0,
        offsetY = 0,
        offsetZ = 0;
      for (offsetZ = 0; offsetZ < chunkSize; offsetZ++) {
        const blockZ = offsetZ + worldZ;
        for (offsetY = 0; offsetY < chunkSize; offsetY++) {
          const blockY = offsetY + worldY;
          if (blockY > this.maxTerrainHeight) continue;
          for (offsetX = 0; offsetX < chunkSize; offsetX++) {
            const blockX = offsetX + worldX;
            // Generate First Octave
            const amplitudeOne = 47.5;
            const spacingOne = 0.04;
            const octaveOne = Math.round(
              (noise.perlin2(blockX * spacingOne, blockZ * spacingOne) * amplitudeOne) / 5
            );
            // Generate Second Octave
            const amplitudeTwo = 300;
            const spacingTwo = 0.005;
            const octaveTwo = Math.round(
              (noise.perlin2(blockX * spacingTwo, blockZ * spacingTwo) * amplitudeTwo) / 5
            );
            // Generate Third Octave
            const amplitudeThree = 1000;
            const spacingThree = 0.007;
            const octaveThree =
              Math.round(
                (noise.perlin2(blockX * amplitudeThree, blockZ * amplitudeThree) * spacingThree) / 5
              ) * 5;
            // Combine The Octaves
            const height = octaveOne + octaveTwo + octaveThree;
            // Set The Height
            if (height > blockY) {
              chunk.setBlock(
                offsetX,
                offsetY,
                offsetZ,
                new Block(blockX, blockY, blockZ, BlockType.Grass)
              );
            } else {
              // If Not Land
              if (blockY < seaLevel) {
                chunk.setBlock(
                  offsetX,
                  offsetY,
                  offsetZ,
                  new Block(blockX, blockY, blockZ, BlockType.Water)
                );
              }
            }
          }
        }
      }
    }
    // Add The Chunk To The World
    this.setChunk(x, y, z, chunk);
    // Return The Chunk
    return chunk;
  }
  // Public Apis
  public getBlock(x: number, y: number, z: number): Block {
    // Get The Chunk The Block Is In
    const chunk = this.getBlockChunk(x, y, z);
    if (chunk == undefined) return new Block(x, y, z, BlockType.Air);
    // Get The Block Coordinates Within The Chunk
    const blockCoordinates = this.getBlockCoordinates(x, y, z);
    // Get The Block From The Chunk
    const block = chunk.getBlock(blockCoordinates[0], blockCoordinates[1], blockCoordinates[2]);
    // Return The Block
    return block;
  }
  public setBlock(x: number, y: number, z: number, block: Block) {
    // Get The Chunk The Block Is In
    const chunk = this.getBlockChunk(x, y, z);
    if (chunk == undefined) return;
    // Get The Block Coordinates Within The Chunk
    const blockCoordinates = this.getBlockCoordinates(x, y, z);
    // Set The Block In The Chunk
    chunk.setBlock(blockCoordinates[0], blockCoordinates[1], blockCoordinates[2], block);
  }
  // Update World
  public updateWorld(deltaTime: number, playerPosition: vec3) {
    const { worldChunks, loadDistance, chunkSize } = this;
    // Calculate Current Load Distance
    const worldLoadDistance = loadDistance * chunkSize;
    // Clear Any Chunks Outside The Loading Distance
    for (const [key, chunk] of worldChunks.entries()) {
      if (chunk === undefined) continue;
      // Check If Chunk Is Out Of Load Distance
      if (
        chunk.x < playerPosition[0] - worldLoadDistance ||
        chunk.x > playerPosition[0] + worldLoadDistance ||
        chunk.y < playerPosition[1] - worldLoadDistance ||
        chunk.y > playerPosition[1] + worldLoadDistance ||
        chunk.z < playerPosition[2] - worldLoadDistance ||
        chunk.z > playerPosition[2] + worldLoadDistance
      ) {
        // Delete The Chunk
        worldChunks.delete(key);
      }
    }
    // TODO: Load The New Chunks
  }
  // Interaction Helpers
  public castRay(origin: vec3, direction: vec3, max: number): vec3 | undefined {
    // Get Forward Vector
    // const forward = vec3.scaleAndAdd(
    //   vec3.create(),
    //   // playerPosition,
    //   playerPosition,
    //   vec3.normalize(
    //     vec3.create(),
    //     vec3.fromValues(
    //       // -180
    //       Math.sin(-playerDirection[0] - Math.PI) * Math.cos(-playerDirection[1]),
    //       Math.sin(playerDirection[1]),
    //       Math.cos(-playerDirection[0] - Math.PI) * Math.cos(-playerDirection[1])
    //     )
    //   ),
    //   5
    // );
    const forwardVector = vec3.normalize(
      vec3.create(),
      vec3.fromValues(
        // -180
        Math.sin(-direction[0] - Math.PI) * Math.cos(-direction[1]),
        Math.sin(direction[1]),
        Math.cos(-direction[0] - Math.PI) * Math.cos(-direction[1])
      )
    );
    const pos = vec3.clone(origin);
    // Go Forward
    let i = 0;
    while (i < max) {
      i++;
      vec3.add(pos, pos, forwardVector);
      // Check Block
      const hit = this.getBlock(Math.trunc(pos[0]), Math.trunc(pos[1]), Math.trunc(pos[2]));
      if (hit.blockType != BlockType.Air)
        return vec3.fromValues(Math.trunc(pos[0]), Math.trunc(pos[1]), Math.trunc(pos[2]));
    }
    return undefined;
    // //Todo: find out why this is so slow
    // const pos = vec3.floor(vec3.create(), origin);

    // const step = vec3.fromValues(
    //   Math.sign(direction[0]),
    //   Math.sign(direction[1]),
    //   Math.sign(direction[2])
    // );
    // const tDelta = vec3.divide(vec3.create(), step, direction);

    // let tMaxX, tMaxY, tMaxZ;

    // const fr = vec3.subtract(vec3.create(), origin, vec3.floor(vec3.create(), origin));

    // tMaxX = tDelta[0] * (direction[0] > 0.0 ? 1.0 - fr[0] : fr[0]);
    // tMaxY = tDelta[1] * (direction[1] > 0.0 ? 1.0 - fr[1] : fr[1]);
    // tMaxZ = tDelta[2] * (direction[2] > 0.0 ? 1.0 - fr[2] : fr[2]);
    // // let norm;
    // let i = 0;
    // do {
    //   const h = this.getBlock(Math.trunc(pos[0]), Math.trunc(pos[1]), Math.trunc(pos[2]));
    //   if (h.blockType != BlockType.Air) {
    //     return vec3.fromValues(h.x, h.y, h.z);
    //   }
    //   if (tMaxX < tMaxY) {
    //     if (tMaxZ < tMaxX) {
    //       tMaxZ += tDelta[2];
    //       pos[2] += step[2];
    //       // norm = vec3.fromValues(0, 0, -step[2]);
    //     } else {
    //       tMaxX += tDelta[0];
    //       pos[0] += step[0];
    //       // norm = vec3.fromValues(-step[0], 0, 0);
    //     }
    //   } else {
    //     if (tMaxZ < tMaxY) {
    //       tMaxZ += tDelta[2];
    //       pos[2] += step[2];
    //       // norm = vec3.fromValues(0, 0, -step[2]);
    //     } else {
    //       tMaxY += tDelta[1];
    //       pos[1] += step[1];
    //       // norm = vec3.fromValues(0, -step[1], 0);
    //     }
    //   }
    //   i++;
    // } while (vec3.distance(origin, pos) < max && i < 100);
    // if (i >= 99) {
    //   console.log(
    //     'blockPosition',
    //     pos,
    //     'blockType',
    //     this.getBlock(Math.trunc(pos[0]), Math.trunc(pos[1]), Math.trunc(pos[2])).blockType,
    //     'distance',
    //     vec3.distance(origin, pos)
    //   );
    // }
    // return undefined;
  }
  // Render World
  public render(renderer: Renderer, playerPosition: vec3, playerDirection: vec3): Mesh[] {
    // Calculate The X And Z Coordinates
    const [chunkX, chunkY, chunkZ] = this.getChunkCoordinates(
      playerPosition[0],
      playerPosition[1],
      playerPosition[2]
    );
    // Render Chunks
    // TODO: Only render the chunks currently in front of the player
    const renderChunks: Mesh[] = [];
    for (let x = -this.renderDistance; x < this.renderDistance; x++) {
      for (let y = -this.renderDistance; y < this.renderDistance; y++) {
        for (let z = -this.renderDistance; z < this.renderDistance; z++) {
          const chunk = this.getChunk(chunkX + x, chunkY + y, chunkZ + z);
          // Render The Chunks
          const chunkMesh = chunk.getMesh();
          if (chunkMesh === undefined) {
            this.renderQueue.push(chunk);
          } else {
            renderChunks.push(chunkMesh);
          }
        }
      }
    }
    // Render Chunks From The Queue
    for (let i = 0; i < Math.min(Math.pow(this.renderDistance, 3), this.renderQueue.length); i++) {
      const chunk = this.renderQueue.pop();
      if (chunk == undefined) break;
      renderChunks.push(chunk.render(this, renderer.gl));
    }
    // Return Mesh
    return renderChunks;
  }
}
export default World;
