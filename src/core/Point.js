export class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  translate(point) {
    return new Point(this.x + point.x, this.y + point.y, this.z + point.z);
  }
}
