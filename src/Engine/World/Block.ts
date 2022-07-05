import type { BlockType, BlockDirection } from '../Types';
import getBlockData from './Blocks/index';
// Block Constructor
class Block {
  // Properties
  public x: number;
  public y: number;
  public z: number;
  public blockType: BlockType;
  // Constructor
  constructor(x: number, y: number, z: number, blockType: BlockType) {
    // Set Properties
    this.x = x;
    this.y = y;
    this.z = z;
    this.blockType = blockType;
  }
  public render(side: BlockDirection, outMesh: number[] = []): number[] {
    // Render Block
    const blockData = getBlockData(this.blockType);
    if (blockData == undefined) return [];
    const texture = blockData.texture(side);
    return blockData.mesh(outMesh, side, texture, this.x, this.y, this.z, [1, 1, 1, 1]);
  }
}
export default Block;
