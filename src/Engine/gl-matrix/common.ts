/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
export const EPSILON = 0.000001;
export const ARRAY_TYPE = (length: number): Float32Array | Array<number> => {
  if (typeof Float32Array !== 'undefined') {
    return new Float32Array(length);
  } else {
    return new Array(length);
  }
};
export const RANDOM = Math.random;
export const ANGLE_ORDER = 'zyx';
const degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

export const toRadian = (a: number): number => {
  return a * degree;
};
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

export const equals = (a: number, b: number): boolean => {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
};
if (!Math.hypot) {
  Math.hypot = function (...args) {
    let y = 0,
      i = args.length;
    while (i--) {
      y += args[i] * args[i];
    }
    return Math.sqrt(y);
  };
}
