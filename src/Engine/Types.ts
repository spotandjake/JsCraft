// Mesh Format
export const enum BlockDirection {
  Down, // Vector(0, -1, 0),
  Up, // Vector(0, 1, 0),
  North, // Vector(0, 0, -1),
  South, // Vector(0, 0, 1),
  East, // Vector(1, 0, 0),
  West, // Vector(-1, 0, 0),
}
export interface Mesh {
  mesh: WebGLBuffer;
  vertexCount: number;
}
// Block types
export const enum BlockType {
  Air,
  Grass,
}
export type BlockTexture = [number, number, number, number];
export type BlockColor = [number, number, number, number];
