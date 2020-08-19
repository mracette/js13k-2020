export class Vector3 {
  constructor(x, y, z) {
    this.type = 'point';
    this.x = x;
    this.y = y;
    this.z = z;
  }
  translate(point) {
    this.x += point.x;
    this.y += point.y;
    this.z += point.z;
    return this;
  }
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}
