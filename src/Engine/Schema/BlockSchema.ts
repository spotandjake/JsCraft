import type { BlockType, BlockDirection, BlockTexture } from '../Types';
// BlockSchema
interface BlockSchema {
  blockType: BlockType;
  transparent: boolean;
  texture: (direction: BlockDirection) => BlockTexture;
  mesh: (
    out: number[],
    direction: BlockDirection,
    texture: BlockTexture,
    x: number,
    y: number,
    z: number
  ) => number[];
}
export default BlockSchema;
