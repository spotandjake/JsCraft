import Block from './Block';
import type World from './World';
import { BlockType, BlockDirection } from '../Types';
import type { Mesh } from '../Types';
class Chunk {
  private blocks: (Block | undefined)[];
  private size: number;
  public mesh: Mesh | undefined = undefined;
  public x: number;
  public y: number;
  public z: number;
  constructor(size: number, x: number, y: number, z: number) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.z = z;
    // Create Block Array
    this.blocks = new Array(this.size * this.size * this.size);
  }
  // Public Api
  public getBlock(x: number, y: number, z: number): Block {
    // If Block Is Out Of Bounds Throw Error
    if (x < 0 || y < 0 || z < 0 || x >= this.size || y >= this.size || z >= this.size)
      throw `Block(x: ${x}, y: ${y}, z: ${z}): Cannot Get Block out Of Chunk Bounds`;
    // Try To Get The Block
    const block = this.blocks[this.toIndex(x, y, z)];
    if (block === undefined) {
      // Return An Air Block By Default
      // TODO: Make This An Air Block
      return new Block(x + this.x, y + this.y, z + this.z, BlockType.Air);
    } else {
      // Return The Block
      return block;
    }
  }
  public setBlock(x: number, y: number, z: number, block: Block) {
    // If Block Is Out Of Bounds Throw Error
    if (x < 0 || y < 0 || z < 0 || x >= this.size || y >= this.size || z >= this.size)
      throw `Block(x: ${x}, y: ${y}): Cannot Set Block out Of Chunk Bounds`;
    // We just clear air blocks
    if (block.blockType == BlockType.Air) {
      this.blocks[this.toIndex(x, y, z)] = undefined;
    } else {
      this.blocks[this.toIndex(x, y, z)] = block;
    }
    // Clear The Mesh Cache
    this.mesh = undefined;
    // TODO: Invalidate Surrounding Chunks If On Edge
  }
  // Rendering Helpers
  private toIndex(x: number, y: number, z: number) {
    const size = this.size;
    return z * size * size + y * size + x;
  }
  // private to3D(index: number) {
  //   const z = index / (this.size * this.size);
  //   index -= z * this.size * this.size;
  //   const y = index / this.size;
  //   const x = index % this.size;
  //   return [x, y, z];
  // }
  public canSeeThrough(x: number, y: number, z: number, currentBlock?: Block): boolean {
    // Try To Get The Block
    const block = this.blocks[this.toIndex(x, y, z)];
    if (block === undefined) {
      return true;
    } else {
      // Test If We Can See Through
      if (
        block.blockType == BlockType.Air ||
        (block.transparent && currentBlock?.blockType != block.blockType)
      )
        return true;
      // TODO: Get Weather The block Is Transparent From The Texture
      return false;
    }
  }
  private _getBlock(x: number, y: number, z: number): Block | undefined {
    return this.blocks[this.toIndex(x, y, z)];
  }
  public render(world: World, gl: WebGL2RenderingContext): Mesh {
    // Generate Mesh Data
    if (this.mesh === undefined) {
      // Create A Chunk mesh with a guess size to try to avoid reallocations based on pushQuad
      const chunkMesh: number[] = [];
      // Generate The Meshes For All The Cubes
      const chunkSize = this.size;
      const chunkSizeMinusOne = chunkSize - 1;
      let x = 0,
        y = 0,
        z = 0;
      for (z = 0; z < chunkSize; z++) {
        for (y = 0; y < chunkSize; y++) {
          for (x = 0; x < chunkSize; x++) {
            // Render The Block Mesh
            const block = this._getBlock(x, y, z);
            if (block === undefined) {
              continue;
            }
            // Determine Which Sides Are Open
            // Cross Chunk Culling
            if (this.canSeeThrough(x, y, z + 1, block)) {
              if (z === chunkSizeMinusOne) {
                // Check Against The Block In The Next Chunk
                const chunk = world.getChunk(
                  this.x / chunkSize,
                  this.y / chunkSize,
                  this.z / chunkSize + 1
                );
                // Get The Block
                const canSeeThrough = chunk.canSeeThrough(x, y, 0, block);
                if (canSeeThrough) {
                  block.render(BlockDirection.South, chunkMesh);
                }
              } else {
                block.render(BlockDirection.South, chunkMesh);
              }
            }
            if (z === 0 || this.canSeeThrough(x, y, z - 1, block)) {
              if (z === 0) {
                // Check Against The Block In The Next Chunk
                const chunk = world.getChunk(
                  this.x / chunkSize,
                  this.y / chunkSize,
                  this.z / chunkSize - 1
                );
                // Get The Block
                const canSeeThrough = chunk.canSeeThrough(x, y, chunkSizeMinusOne, block);
                if (canSeeThrough) {
                  block.render(BlockDirection.North, chunkMesh);
                }
              } else {
                block.render(BlockDirection.North, chunkMesh);
              }
            }
            if (x === chunkSizeMinusOne || this.canSeeThrough(x + 1, y, z, block)) {
              if (x === chunkSizeMinusOne) {
                // Check Against The Block In The Next Chunk
                const chunk = world.getChunk(
                  this.x / chunkSize + 1,
                  this.y / chunkSize,
                  this.z / chunkSize
                );
                // Get The Block
                const canSeeThrough = chunk.canSeeThrough(0, y, z, block);
                if (canSeeThrough) {
                  block.render(BlockDirection.East, chunkMesh);
                }
              } else {
                block.render(BlockDirection.East, chunkMesh);
              }
            }
            if (x === 0 || this.canSeeThrough(x - 1, y, z, block)) {
              if (x === 0) {
                // Check Against The Block In The Next Chunk
                const chunk = world.getChunk(
                  this.x / chunkSize - 1,
                  this.y / chunkSize,
                  this.z / chunkSize
                );
                // Get The Block
                const canSeeThrough = chunk.canSeeThrough(chunkSizeMinusOne, y, z, block);
                if (canSeeThrough) {
                  block.render(BlockDirection.West, chunkMesh);
                }
              } else {
                block.render(BlockDirection.West, chunkMesh);
              }
            }
            if (y === chunkSizeMinusOne || this.canSeeThrough(x, y + 1, z, block)) {
              if (y === chunkSizeMinusOne) {
                // Check Against The Block In The Next Chunk
                const chunk = world.getChunk(
                  this.x / chunkSize,
                  this.y / chunkSize + 1,
                  this.z / chunkSize
                );
                // Get The Block
                const canSeeThrough = chunk.canSeeThrough(x, 0, z, block);
                if (canSeeThrough) {
                  block.render(BlockDirection.Up, chunkMesh);
                }
              } else {
                block.render(BlockDirection.Up, chunkMesh);
              }
            }
            if (y === 0 || this.canSeeThrough(x, y - 1, z, block)) {
              if (y === 0) {
                // Check Against The Block In The Next Chunk
                const chunk = world.getChunk(
                  this.x / chunkSize,
                  this.y / chunkSize - 1,
                  this.z / chunkSize
                );
                // Get The Block
                const canSeeThrough = chunk.canSeeThrough(x, chunkSizeMinusOne, z, block);
                if (canSeeThrough) {
                  block.render(BlockDirection.Down, chunkMesh);
                }
              } else {
                block.render(BlockDirection.Down, chunkMesh);
              }
            }
            // TODO: If The Quad is not The Full Width Determine If We Need To Show The Other Sides
            // TODO: Handle Transparent Meshes
          }
        }
      }
      // Pack The Mesh
      const buffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      const _chunkMesh = Float32Array.from(chunkMesh);
      gl.bufferData(gl.ARRAY_BUFFER, _chunkMesh, gl.STATIC_DRAW);
      // Cache The Mesh
      this.mesh = {
        mesh: buffer,
        vertexCount: chunkMesh.length / 8,
      };
    }
    return this.mesh;
  }
  public getMesh() {
    // Return The Mesh
    return this.mesh;
  }
}
export default Chunk;
