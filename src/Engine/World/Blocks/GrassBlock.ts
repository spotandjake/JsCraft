import { BlockType, BlockDirection } from '../../Types';
import cubeMesh from './Mesh/Cube';
export default {
  blockType: BlockType.Grass,
  transparent: false,
  texture: (direction: BlockDirection): [number, number, number, number] => {
    // Handle The Block
    switch (direction) {
      case BlockDirection.Down:
        return [2 / 16, 0 / 16, 3 / 16, 1 / 16];
      case BlockDirection.Up:
        return [14 / 16, 0 / 16, 15 / 16, 1 / 16];
      default:
        return [3 / 16, 0 / 16, 4 / 16, 1 / 16];
    }
  },
  mesh: cubeMesh,
};
