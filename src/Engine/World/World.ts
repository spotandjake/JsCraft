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
    return vec3.fromValues(
      Math.abs(x % this.chunkSize),
      Math.abs(y % this.chunkSize),
      Math.abs(z % this.chunkSize)
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
        for (offsetY = 0; offsetY < chunkSize; offsetY++) {
          for (offsetX = 0; offsetX < chunkSize; offsetX++) {
            // Calculate world Cords
            const blockX = offsetX + worldX;
            const blockY = offsetY + worldY;
            const blockZ = offsetZ + worldZ;
            // Generate World
            if (blockY > this.maxTerrainHeight) continue;
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
  // Render World
  public render(renderer: Renderer, playerPosition: vec3, playerDirection: vec3): Mesh[] {
    // Calculate The X And Z Coordinates
    const [chunkX, chunkY, chunkZ] = this.getChunkCoordinates(
      playerPosition[0],
      playerPosition[1],
      playerPosition[2]
    );
    // Render Chunks
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
    // Render Five Chunks From The Queue
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
