import { BlockDirection } from '../../../Types';
import type { BlockTexture } from '../../../Types';
import { pushQuad } from '../../../Utils';
export default (
  out: number[],
  direction: BlockDirection,
  texture: BlockTexture,
  x: number,
  y: number,
  z: number
): number[] => {
  // Basic Cube Mesh
  // Render The Given Side
  switch (direction) {
    case BlockDirection.Down:
      return pushQuad(
        out,
        [x, y, z, texture[0], texture[1], 0, -1, 0],
        [x + 1, y, z, texture[2], texture[1], -1, 0, 0],
        [x + 1, y, z + 1, texture[2], texture[3], 0, -1, 0],
        [x, y, z + 1, texture[0], texture[3], 0, -1, 0]
      );
    case BlockDirection.Up: {
      return pushQuad(
        out,
        [x, y + 1, z + 1, texture[0], texture[1], 0, 1, 0],
        [x + 1, y + 1, z + 1, texture[2], texture[1], 1, 0, 0],
        [x + 1, y + 1, z, texture[2], texture[3], 0, 1, 0],
        [x, y + 1, z, texture[0], texture[3], 0, 1, 0]
      );
    }
    case BlockDirection.North:
      return pushQuad(
        out,
        [x, y + 1, z, texture[0], texture[1], 0, 0, 1],
        [x + 1, y + 1, z, texture[2], texture[1], 0, 0, 1],
        [x + 1, y, z, texture[2], texture[3], 0, 0, 1],
        [x, y, z, texture[0], texture[3], 0, 0, 1]
      );
    case BlockDirection.South:
      return pushQuad(
        out,
        [x, y, z + 1, texture[2], texture[3], 0, 0, -1],
        [x + 1, y, z + 1, texture[0], texture[3], 0, 0, -1],
        [x + 1, y + 1, z + 1, texture[0], texture[1], 0, 0, -1],
        [x, y + 1, z + 1, texture[2], texture[1], 0, 0, -1]
      );
    case BlockDirection.East:
      return pushQuad(
        out,
        [x + 1, y, z, texture[2], texture[3], 1, 0, 0],
        [x + 1, y + 1, z, texture[2], texture[1], 1, 0, 0],
        [x + 1, y + 1, z + 1, texture[0], texture[1], 1, 0, 0],
        [x + 1, y, z + 1, texture[0], texture[3], 1, 0, 0]
      );
    case BlockDirection.West:
      return pushQuad(
        out,
        [x, y, z + 1, texture[2], texture[3], -1, 0, 0],
        [x, y + 1, z + 1, texture[2], texture[1], -1, 0, 0],
        [x, y + 1, z, texture[0], texture[1], -1, 0, 0],
        [x, y, z, texture[0], texture[3], -1, 0, 0]
      );
    default:
      return [];
  }
};
