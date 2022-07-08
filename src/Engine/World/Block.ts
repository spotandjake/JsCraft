import { BlockType, BlockDirection, BlockColor } from '../Types';
import getBlockData from './Blocks/index';
// Block Constructor
class Block {
  // Properties
  public x: number;
  public y: number;
  public z: number;
  public blockType: BlockType;
  // TODO: Get Weather The block Is Transparent From The Texture
  public transparent: boolean;
  // Constructor
  constructor(x: number, y: number, z: number, blockType: BlockType) {
    // Set Properties
    this.x = x;
    this.y = y;
    this.z = z;
    this.blockType = blockType;
    // Get Transparency
    // TODO: Get Weather The block Is Transparent From The Texture
    const blockData = getBlockData(this.blockType);
    if (blockData == undefined) {
      this.transparent = false;
    } else {
      this.transparent = blockData.transparent;
    }
  }
  public render(side: BlockDirection, outMesh: number[] = [], color: BlockColor): number[] {
    // Render Block
    const blockData = getBlockData(this.blockType);
    if (blockData == undefined) return [];
    const texture = blockData.texture(side);
    return blockData.mesh(outMesh, side, texture, this.x, this.y, this.z, color);
  }
}
export default Block;
