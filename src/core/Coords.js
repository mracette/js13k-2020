export class CanvasCoordinates {
  constructor(canvas) {
    this._baseWidth = canvas.width;
    this._baseHeight = canvas.height;
  }

  nx(n) {
    return this._baseWidth * (n + 1 / 2);
  }

  ny(n) {
    return this._baseHeight * (n + 1 / 2);
  }

  width(n) {
    let w = this._baseWidth;
    if (typeof n !== 'undefined') {
      return w * n;
    }
    return w;
  }

  height(n) {
    let h = this._baseHeight;
    if (typeof n !== 'undefined') {
      return h * n;
    }
    return h;
  }

  resize() {
    this._baseWidth = this.baseWidth || this.canvas.width;
    this._baseHeight = this.baseHeight || this.canvas.height;
  }
}
