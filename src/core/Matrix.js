export class Matrix {
  constructor(arrayConstructor) {
    const cache = {};
    Object.assign(this, { arrayConstructor, cache });
  }
  get(params, transpose = false) {
    const paramsKey = params.toString() + (transpose ? 'transpose' : '');
    if (this.cache.hasOwnProperty(paramsKey)) {
      return this.cache[paramsKey];
    } else {
      this.cache[paramsKey] = transpose
        ? this.transpose(this.arrayConstructor(params))
        : this.arrayConstructor(params);
      return this.cache[paramsKey];
    }
  }
  transpose(a) {
    return Object.keys(a[0]).map(function (c) {
      return a.map(function (r) {
        return r[c];
      });
    });
  }
}

export const Rx = new Matrix((n) => [
  [1, 0, 0],
  [0, Math.cos(n), -Math.sin(n)],
  [0, Math.sin(n), Math.cos(n)]
]);

export const Ry = new Matrix((n) => [
  [Math.cos(n), 0, Math.sin(n)],
  [0, 1, 0],
  [-Math.sin(n), 0, Math.cos(n)]
]);

export const Rz = new Matrix((n) => [
  [Math.cos(n), -Math.sin(n), 0],
  [Math.sin(n), Math.cos(n), 0],
  [0, 0, 1]
]);
