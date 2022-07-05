// prettier-ignore
export type mat2 =
  | [number, number, 
     number, number]
  | Float32Array;

// prettier-ignore
export type mat2d =
  | [number, number, 
     number, number, 
     number, number]
  | Float32Array;

// prettier-ignore
export type mat3 =
  | [number, number, number, 
     number, number, number, 
     number, number, number]
  | Float32Array;

// prettier-ignore
export type mat4 =
  | [number, number, number, number,
     number, number, number, number,
     number, number, number, number,
     number, number, number, number]
  | Float32Array;

export type quat = [number, number, number, number] | Float32Array;

// prettier-ignore
export type quat2 =
  | [number, number, number, number, 
    number, number, number, number]
  | Float32Array;

export type vec2 = [number, number] | Float32Array;
export type vec3 = [number, number, number] | Float32Array;
export type vec4 = [number, number, number, number] | Float32Array;

// prettier-ignore
export type ReadonlyMat2 =
  | readonly [
      number, number,
      number, number
    ]
  | Float32Array;

// prettier-ignore
export type ReadonlyMat2d =
  | readonly [
      number, number,
      number, number,
      number, number
    ]
  | Float32Array;

// prettier-ignore
export type ReadonlyMat3 =
  | readonly [
      number, number, number,
      number, number, number,
      number, number, number
    ]
  | Float32Array;

// prettier-ignore
export type ReadonlyMat4 =
  | readonly [
      number, number, number, number,
      number, number, number, number,
      number, number, number, number,
      number, number, number, number
    ]
  | Float32Array;

export type ReadonlyQuat = readonly [number, number, number, number] | Float32Array;

export type ReadonlyQuat2 =
  | readonly [number, number, number, number, number, number, number, number]
  | Float32Array;

export type ReadonlyVec2 = readonly [number, number] | Float32Array;
export type ReadonlyVec3 = readonly [number, number, number] | Float32Array;
export type ReadonlyVec4 = readonly [number, number, number, number] | Float32Array;
