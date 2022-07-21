import { BlockType, BlockDirection } from '../../Types';
import cubeMesh from './Mesh/Cube';
export default {
  blockType: BlockType.Stone,
  transparent: false,
  texture: (direction: BlockDirection): [number, number, number, number] => {
    // Handle The Block
    return [1 / 16, 0 / 16, 2 / 16, 1 / 16];
  },
  mesh: cubeMesh,
};
