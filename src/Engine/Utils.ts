const radianConversionFactor = Math.PI / 180;
const degreesConversionFactor = 180 / Math.PI;
export const degreesToRadians = (degrees: number): number => radianConversionFactor * degrees;
export const radiansToDegrees = (radians: number): number => degreesConversionFactor * radians;
export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);
// Meshing Helpers
export const pushQuad = (v: number[], p1: number[], p2: number[], p3: number[], p4: number[]) => {
  // Cached Array Lengths
  const vLength = v.length;
  const p1Length = p1.length;
  const p2Length = p2.length;
  const p3Length = p3.length;
  const p4Length = p4.length;
  // Lengths At State
  const lenA = vLength;
  const lenB = vLength + p1Length;
  const lenC = lenB + p2Length;
  const lenD = lenC + p3Length;
  const lenE = lenD + p3Length;
  const lenF = lenE + p4Length;
  // Set The Array Length To The Proper Size
  v.length = vLength + p1Length + p2Length + p3Length + p3Length + p4Length + p1Length;
  // Fill The Array
  let i = 0;
  for (i = 0; i < p1Length; ++i) {
    v[lenA + i] = p1[i];
  }
  for (i = 0; i < p2Length; ++i) {
    v[lenB + i] = p2[i];
  }
  for (i = 0; i < p3Length; ++i) {
    v[lenC + i] = p3[i];
  }
  for (i = 0; i < p3Length; ++i) {
    v[lenD + i] = p3[i];
  }
  for (i = 0; i < p4Length; ++i) {
    v[lenE + i] = p4[i];
  }
  for (i = 0; i < p1Length; ++i) {
    v[lenF + i] = p1[i];
  }
  return v;
};
