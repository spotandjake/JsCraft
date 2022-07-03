import Chunk from './Chunk';
import Block from './Block';
import { Mesh, BlockType } from '../Types';
import Vector from '../Vector';
import Renderer from '../Renderer';
interface InternalWorldChunks {
  [key: number]: {
    [key: number]: {
      [key: number]: Chunk;
    };
  };
}
class World {
  // Internal Storage
  private seed: number;
  private chunks: InternalWorldChunks;
  private worldSpawn: Vector = new Vector(0, 0, 0);
  private chunkSize = 32;
  private renderDistance: number;
  // Optimal loadArea = 7
  constructor(seed: number, loadArea = 4) {
    // If The Seed is 0 then we are using a flat world
    this.seed = seed;
    this.renderDistance = loadArea;
    // Initialize The World Array
    this.chunks = {};
    // PreInitialize The World
    for (let x = -loadArea; x < loadArea; x++) {
      for (let y = -loadArea; y < loadArea; y++) {
        for (let z = -loadArea; z < loadArea; z++) {
          // Calculate The X And Z Coordinates
          const chunkPosition = this.getChunkCoordinates(
            this.worldSpawn.x,
            this.worldSpawn.y,
            this.worldSpawn.z
          ).add(x, y, z);
          this.generateChunk(chunkPosition.x, chunkPosition.y, chunkPosition.z);
        }
      }
    }
    // Find The Spawn, y
  }
  // Internal Helper
  private getBlockChunk(x: number, y: number, z: number) {
    const chunkPosition = this.getChunkCoordinates(x, y, z);
    // Check The Chunk Exists
    if (
      this.chunks[chunkPosition.x] == undefined ||
      this.chunks[chunkPosition.x][chunkPosition.y] == undefined ||
      this.chunks[chunkPosition.x][chunkPosition.y][chunkPosition.z] == undefined
    )
      return;
    // Get The Chunk
    const chunk = this.chunks[chunkPosition.x][chunkPosition.y][chunkPosition.y];
    // Return The Chunk
    return chunk;
  }
  private getChunkCoordinates(x: number, y: number, z: number) {
    const chunkX = x > 0 ? Math.ceil(x / this.chunkSize) : Math.floor(x / this.chunkSize);
    const chunkY = y > 0 ? Math.ceil(y / this.chunkSize) : Math.floor(y / this.chunkSize);
    const chunkZ = z > 0 ? Math.ceil(z / this.chunkSize) : Math.floor(z / this.chunkSize);
    return new Vector(chunkX, chunkY, chunkZ);
  }
  private getBlockCoordinates(x: number, y: number, z: number) {
    return new Vector(x % this.chunkSize, y % this.chunkSize, z % this.chunkSize);
  }
  // Safe Chunk Elements Manipulation
  private setChunk(x: number, y: number, z: number, chunk: Chunk) {
    if (this.chunks[x] == undefined) this.chunks[x] = {};
    if (this.chunks[x][y] == undefined) this.chunks[x][y] = {};
    this.chunks[x][y][z] = chunk;
  }
  private getChunk(x: number, y: number, z: number) {
    if (this.chunks[x] == undefined) this.chunks[x] = {};
    if (this.chunks[x][y] == undefined) this.chunks[x][y] = {};
    return this.chunks[x][y][z];
  }
  // Generate World
  private generateChunk(x: number, y: number, z: number) {
    // TODO: Implement This
    // Create A New Chunk
    const chunk = new Chunk(
      this.chunkSize,
      x * this.chunkSize,
      y * this.chunkSize,
      z * this.chunkSize
    );
    // TODO: Set The Terrain
    // If The Seed is 0 then Generate Flat World
    if (this.seed == 0) {
      for (let offsetX = 0; offsetX < this.chunkSize; offsetX++) {
        for (let offsetY = 0; offsetY < this.chunkSize; offsetY++) {
          for (let offsetZ = 0; offsetZ < this.chunkSize; offsetZ++) {
            // Calculate world Cords
            const blockX = offsetX + x * this.chunkSize;
            const blockY = offsetY + y * this.chunkSize;
            const blockZ = offsetZ + z * this.chunkSize;
            // Conditions For Flat World
            if (blockY <= 1) {
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
    }
    // Otherwise Generate A Random World
    // Add The Chunk To The World
    this.setChunk(x, y, z, chunk);
    // Return The Chunk
    return chunk;
  }
  // Public Apis
  public getBlock(x: number, y: number, z: number) {
    // Get The Chunk The Block Is In
    const chunk = this.getBlockChunk(x, y, z);
    if (chunk == undefined) return;
    // Get The Block Coordinates Within The Chunk
    const blockCoordinates = this.getBlockCoordinates(x, y, z);
    // Get The Block From The Chunk
    const block = chunk.getBlock(blockCoordinates.x, blockCoordinates.y, blockCoordinates.z);
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
    chunk.setBlock(blockCoordinates.x, blockCoordinates.y, blockCoordinates.z, block);
  }
  public render(renderer: Renderer, playerPosition: Vector): Mesh[] {
    const renderChunks: Mesh[] = [];
    for (let x = -this.renderDistance; x < this.renderDistance; x++) {
      for (let y = -this.renderDistance; y < this.renderDistance; y++) {
        for (let z = -this.renderDistance; z < this.renderDistance; z++) {
          // Calculate The X And Z Coordinates
          const chunkPosition = this.getChunkCoordinates(
            playerPosition.x,
            playerPosition.y,
            playerPosition.z
          ).add(x, y, z);
          const chunk =
            this.getChunk(chunkPosition.x, chunkPosition.y, chunkPosition.z) ??
            this.generateChunk(chunkPosition.x, chunkPosition.y, chunkPosition.z);
          // Render The Chunks
          renderChunks.push(chunk.render(renderer));
        }
      }
    }
    // Return Mesh
    return renderChunks;
  }
}
export default World;
