import { pushQuad } from './Utils';
export default (out: number[], x: number, y: number, z: number): number[] => {
  const texture = [3 / 16, 13 / 16, 4 / 16, 14 / 16];
  // Down
  pushQuad(
    out,
    [x - 0.25, y - 0.25, z - 0.25, texture[0], texture[1], 0, -1, 0],
    [x + 0.25, y - 0.25, z - 0.25, texture[2], texture[1], -1, 0, 0],
    [x + 0.25, y - 0.25, z + 0.25, texture[2], texture[3], 0, -1, 0],
    [x - 0.25, y - 0.25, z + 0.25, texture[0], texture[3], 0, -1, 0]
  );
  // Up
  pushQuad(
    out,
    [x - 0.25, y + 0.25, z + 0.25, texture[0], texture[1], 0, 1, 0],
    [x + 0.25, y + 0.25, z + 0.25, texture[2], texture[1], 1, 0, 0],
    [x + 0.25, y + 0.25, z - 0.25, texture[2], texture[3], 0, 1, 0],
    [x - 0.25, y + 0.25, z - 0.25, texture[0], texture[3], 0, 1, 0]
  );
  // North
  pushQuad(
    out,
    [x - 0.25, y + 0.25, z - 0.25, texture[0], texture[1], 0, 0, 1],
    [x + 0.25, y + 0.25, z - 0.25, texture[2], texture[1], 0, 0, 1],
    [x + 0.25, y - 0.25, z - 0.25, texture[2], texture[3], 0, 0, 1],
    [x - 0.25, y - 0.25, z - 0.25, texture[0], texture[3], 0, 0, 1]
  );
  // South
  pushQuad(
    out,
    [x - 0.25, y - 0.25, z + 0.25, texture[2], texture[3], 0, 0, -1],
    [x + 0.25, y - 0.25, z + 0.25, texture[0], texture[3], 0, 0, -1],
    [x + 0.25, y + 0.25, z + 0.25, texture[0], texture[1], 0, 0, -1],
    [x - 0.25, y + 0.25, z + 0.25, texture[2], texture[1], 0, 0, -1]
  );
  // East
  pushQuad(
    out,
    [x + 0.25, y - 0.25, z - 0.25, texture[2], texture[3], 1, 0, 0],
    [x + 0.25, y + 0.25, z - 0.25, texture[2], texture[1], 1, 0, 0],
    [x + 0.25, y + 0.25, z + 0.25, texture[0], texture[1], 1, 0, 0],
    [x + 0.25, y - 0.25, z + 0.25, texture[0], texture[3], 1, 0, 0]
  );
  // West
  return pushQuad(
    out,
    [x - 0.25, y - 0.25, z + 0.25, texture[2], texture[3], -1, 0, 0],
    [x - 0.25, y + 0.25, z + 0.25, texture[2], texture[1], -1, 0, 0],
    [x - 0.25, y + 0.25, z - 0.25, texture[0], texture[1], -1, 0, 0],
    [x - 0.25, y - 0.25, z - 0.25, texture[0], texture[3], -1, 0, 0]
  );
};
