import { BlockType, BlockDirection } from '../../Types';
import cubeMesh from './Mesh/Cube';
export default {
  blockType: BlockType.Water,
  transparent: true,
  texture: (direction: BlockDirection): [number, number, number, number] => {
    // Handle The Block
    return [13 / 16, 12 / 16, 14 / 16, 13 / 16];
  },
  mesh: cubeMesh,
};
