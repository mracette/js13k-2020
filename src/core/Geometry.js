import { G } from '../globals';
import { Vector3 } from './Vector3';

export class Geometry {
  constructor(opts = {}) {
    this.type = 'geometry';
    this.name = opts.name || G.UID++;
    this.faces = [];
  }
}

export class BlenderGeometry extends Geometry {
  constructor(config, opts) {
    super(opts);
    Object.assign(this, config);
  }
  getFaces() {
    const arr = [];
    this.faces.forEach((face, i) => {
      arr[i] = [];
      face.forEach((index) => {
        arr[i].push(new Vector3(...this.vertices[index]));
      });
    });
    return arr;
  }
  getNormals() {
    return this.normals;
  }
}
