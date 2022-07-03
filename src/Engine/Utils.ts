const radianConversionFactor = Math.PI / 180;
const degreesConversionFactor = 180 / Math.PI;
export const degreesToRadians = (degrees: number): number => radianConversionFactor * degrees;
export const radiansToDegrees = (radians: number): number => degreesConversionFactor * radians;
export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);
// Meshing Helpers
export const pushQuad = (v: number[], p1: number[], p2: number[], p3: number[], p4: number[]) => {
  // 1160
  const lenA = v.length;
  let i = 0;
  for (i = 0; i < p1.length; i++) {
    v[lenA + i] = p1[i];
  }
  const lenB = v.length;
  for (i = 0; i < p2.length; i++) {
    v[lenB + i] = p2[i];
  }
  const lenC = v.length;
  for (i = 0; i < p3.length; i++) {
    v[lenC + i] = p3[i];
  }
  const lenD = v.length;
  for (i = 0; i < p4.length; i++) {
    v[lenD + i] = p4[i];
  }
  return v;
};
