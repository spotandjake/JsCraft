import { BlockType, BlockDirection } from '../../Types';
import type { BlockTexture, BlockColor } from '../../Types';
import { pushQuad } from '../../Utils';
export default {
  blockType: BlockType.Water,
  transparent: true,
  texture: (direction: BlockDirection): [number, number, number, number] => {
    // Handle The Block
    return [13 / 16, 12 / 16, 14 / 16, 13 / 16];
  },
  mesh: (
    out: number[],
    direction: BlockDirection,
    texture: BlockTexture,
    x: number,
    y: number,
    z: number,
    color: BlockColor
  ): number[] => {
    // Render The Given Side
    switch (direction) {
      case BlockDirection.Down:
        return pushQuad(
          out,
          [x, y, z, texture[0], texture[1], ...color],
          [x + 1, y, z, texture[2], texture[1], ...color],
          [x + 1, y, z + 1, texture[2], texture[3], ...color],
          [x, y, z + 1, texture[0], texture[3], ...color]
        );
      case BlockDirection.Up: {
        return pushQuad(
          out,
          [x, y + 1, z + 1, texture[0], texture[1], ...color],
          [x + 1, y + 1, z + 1, texture[2], texture[1], ...color],
          [x + 1, y + 1, z, texture[2], texture[3], ...color],
          [x, y + 1, z, texture[0], texture[3], ...color]
        );
      }
      case BlockDirection.North:
        return pushQuad(
          out,
          [x, y + 1, z, texture[0], texture[1], ...color],
          [x + 1, y + 1, z, texture[2], texture[1], ...color],
          [x + 1, y, z, texture[2], texture[3], ...color],
          [x, y, z, texture[0], texture[3], ...color]
        );
      case BlockDirection.South:
        return pushQuad(
          out,
          [x, y, z + 1, texture[2], texture[3], ...color],
          [x + 1, y, z + 1, texture[0], texture[3], ...color],
          [x + 1, y + 1, z + 1, texture[0], texture[1], ...color],
          [x, y + 1, z + 1, texture[2], texture[1], ...color]
        );
      case BlockDirection.East:
        return pushQuad(
          out,
          [x + 1, y, z, texture[2], texture[3], ...color],
          [x + 1, y + 1, z, texture[2], texture[1], ...color],
          [x + 1, y + 1, z + 1, texture[0], texture[1], ...color],
          [x + 1, y, z + 1, texture[0], texture[3], ...color]
        );
      case BlockDirection.West:
        return pushQuad(
          out,
          [x, y, z + 1, texture[2], texture[3], ...color],
          [x, y + 1, z + 1, texture[2], texture[1], ...color],
          [x, y + 1, z, texture[0], texture[1], ...color],
          [x, y, z, texture[0], texture[3], ...color]
        );
      default:
        return [];
    }
  },
};
