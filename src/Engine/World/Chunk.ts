import Block from './Block';
import { Mesh, BlockType, BlockDirection } from '../Types';
import Renderer from '../Renderer';
class Chunk {
  private blocks: Block[];
  private size: number;
  private mesh: Mesh | undefined = undefined;
  private x: number;
  private y: number;
  private z: number;
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
      throw `Block(x: ${x}, y: ${y}): Cannot Get Block out Of Chunk Bounds`;
    // Try To Get The Block
    const block = this.blocks[x + y * this.size + z * this.size];
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
    // Set The Block
    this.blocks[x + y * this.size + z * this.size] = block;
    // Clear The Mesh Cache
    this.mesh = undefined;
  }
  private _getBlock(x: number, y: number, z: number): Block | undefined {
    // Try To Get The Block
    const block = this.blocks[x + y * this.size + z * this.size];
    return block;
  }
  private canSeeThrough(x: number, y: number, z: number): boolean {
    // If Block Is Out Of Bounds Throw Error
    if (x < 0 || y < 0 || z < 0 || x >= this.size || y >= this.size || z >= this.size) return true;
    // Try To Get The Block
    const block = this.blocks[x + y * this.size + z * this.size];
    if (block === undefined) {
      return true;
    } else {
      return block.blockType === BlockType.Air;
    }
  }
  public render(renderer: Renderer): Mesh {
    // Generate Mesh Data
    if (this.mesh === undefined) {
      // Create A Chunk mesh with a guess size to try to avoid reallocations based on pushQuad
      const chunkMesh: number[] = [];
      // Generate The Meshes For All The Cubes
      const chunkSize = this.size;
      for (let x = 0; x < chunkSize; x++) {
        for (let y = 0; y < chunkSize; y++) {
          for (let z = 0; z < chunkSize; z++) {
            // Render The Block Mesh
            const block = this._getBlock(x, y, z);
            if (block === undefined) {
              continue;
            }
            // Determine Which Sides Are Open
            // TODO: Define Open Block
            if (this.canSeeThrough(x, y + 1, z)) {
              block.render(BlockDirection.Up, chunkMesh);
            }
            if (this.canSeeThrough(x, y - 1, z)) {
              block.render(BlockDirection.Down, chunkMesh);
            }
            if (this.canSeeThrough(x, y, z + 1)) {
              block.render(BlockDirection.South, chunkMesh);
            }
            if (this.canSeeThrough(x, y, z - 1)) {
              block.render(BlockDirection.North, chunkMesh);
            }
            if (this.canSeeThrough(x + 1, y, z)) {
              block.render(BlockDirection.East, chunkMesh);
            }
            if (this.canSeeThrough(x - 1, y, z)) {
              block.render(BlockDirection.West, chunkMesh);
            }
            // TODO: If The Quad is not The Full Width Determine If We Need To Show The Other Sides
            // TODO: Handle Transparent Meshes
          }
        }
      }
      // Pack The Mesh
      const gl = renderer.gl;
      const buffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      // TODO: This takes 1.5 seconds a alone
      const _chunkMesh = new Float32Array(chunkMesh);
      gl.bufferData(gl.ARRAY_BUFFER, _chunkMesh, gl.STATIC_DRAW);
      // Cache The Mesh
      this.mesh = {
        mesh: buffer,
        vertexCount: chunkMesh.length / 9,
      };
      // Return The Mesh
      return this.mesh;
    } else {
      // Return The Cached Mesh
      return this.mesh;
    }
  }
}
export default Chunk;
