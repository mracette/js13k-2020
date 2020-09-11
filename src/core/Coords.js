export class CanvasCoordinates {
  constructor(canvas) {
    this._baseWidth = canvas.width;
    this._baseHeight = canvas.height;
  }

  nx(n) {
    return this._baseWidth * ((n + 1) / 2);
  }

  ny(n) {
    return this._baseHeight * ((n + 1) / 2);
  }

  width(n) {
    if (typeof n !== 'undefined') {
      return this._baseWidth * n;
    }
    return this._baseWidth;
  }

  height(n) {
    if (typeof n !== 'undefined') {
      return this._baseHeight * n;
    }
    return this._baseHeight;
  }
}
