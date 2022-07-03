import { BlockType, BlockDirection } from '../Types';
import { pushQuad } from '../Utils';
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
    if (this.blockType === BlockType.Air) return [];
    const { x, y, z } = this;
    // Return The Different Side Meshes
    // TODO: Bind this to block data
    const color = {
      r: 0,
      g: 1,
      b: 0,
      a: 1,
    };
    // TODO: Bind this to block data
    switch (side) {
      case BlockDirection.Down:
        return pushQuad(
          outMesh,
          [x, y, z, 0, 0, color.r, color.g, color.b, color.a],
          [x + 1, y, z, 1, 0, color.r, color.g, color.b, color.a],
          [x + 1, y, z + 1, 1, 1, color.r, color.g, color.b, color.a],
          [x, y, z + 1, 0, 0, color.r, color.g, color.b, color.a]
        );
      case BlockDirection.Up:
        return pushQuad(
          outMesh,
          [x, y + 1, z + 1, 0, 0, color.r, color.g, color.b, color.a],
          [x + 1, y + 1, z + 1, 1, 0, color.r, color.g, color.b, color.a],
          [x + 1, y + 1, z, 1, 1, color.r, color.g, color.b, color.a],
          [x, y + 1, z, 0, 0, color.r, color.g, color.b, color.a]
        );
      case BlockDirection.North:
        return pushQuad(
          outMesh,
          [x, y + 1, z, 0, 0, color.r, color.g, color.b, color.a],
          [x + 1, y + 1, z, 1, 0, color.r, color.g, color.b, color.a],
          [x + 1, y, z, 1, 1, color.r, color.g, color.b, color.a],
          [x, y, z, 0, 0, color.r, color.g, color.b, color.a]
        );
      case BlockDirection.South:
        return pushQuad(
          outMesh,
          [x, y, z + 1, 0, 0, color.r, color.g, color.b, color.a],
          [x + 1, y, z + 1, 1, 0, color.r, color.g, color.b, color.a],
          [x + 1, y + 1, z + 1, 1, 1, color.r, color.g, color.b, color.a],
          [x, y + 1, z + 1, 0, 0, color.r, color.g, color.b, color.a]
        );
      case BlockDirection.East:
        return pushQuad(
          outMesh,
          [x + 1, y, z, 0, 0, color.r, color.g, color.b, color.a],
          [x + 1, y + 1, z, 1, 0, color.r, color.g, color.b, color.a],
          [x + 1, y + 1, z + 1, 1, 1, color.r, color.g, color.b, color.a],
          [x + 1, y, z + 1, 0, 0, color.r, color.g, color.b, color.a]
        );
      case BlockDirection.West:
        return pushQuad(
          outMesh,
          [x, y, z + 1, 0, 0, color.r, color.g, color.b, color.a],
          [x, y + 1, z + 1, 1, 0, color.r, color.g, color.b, color.a],
          [x, y + 1, z, 1, 1, color.r, color.g, color.b, color.a],
          [x, y, z, 0, 0, color.r, color.g, color.b, color.a]
        );
    }
  }
}
export default Block;
