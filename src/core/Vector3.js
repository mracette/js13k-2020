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
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    this.z = Math.round(this.z);
    return this;
  }
  set(vector) {
    this.x = vector.x;
    this.y = vector.y;
    this.z = vector.z;
    return this;
  }
  vectorTo(vector) {
    console.log(vector, this);
    return new Vector3(vector.x - this.x, vector.y - this.y, vector.z - this.z);
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}
