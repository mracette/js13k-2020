export class Vector3 {
  constructor(x, y, z) {
    this.type = 'point';
    this.x = x;
    this.y = y;
    this.z = z;
  }
  translate(vector) {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    return this;
  }
  set(vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}
