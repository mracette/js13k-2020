import { G } from '../globals';

export class Geometry {
  constructor(opts = {}) {
    this.type = 'geometry';
    this.name = opts.name || G.UID++;
    this.faces = [];
  }
}
