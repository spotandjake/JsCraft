import { BlockType, BlockDirection, BlockTexture, BlockColor } from '../Types';
// BlockSchema
interface BlockSchema {
  blockType: BlockType;
  texture: (direction: BlockDirection) => BlockTexture;
  mesh: (
    out: number[],
    direction: BlockDirection,
    texture: BlockTexture,
    x: number,
    y: number,
    z: number,
    color: BlockColor
  ) => number[];
}
export default BlockSchema;
