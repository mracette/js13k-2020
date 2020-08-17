import { G } from '../globals';
import { Point } from './Point';

export class Mesh {
  /**
   * @param {Array} geometry
   * @param {Array} style
   * @param {Point} opts.rotation
   * @param {Point} opts.rotation
   * @param {Point} opts.scale
   */

  constructor(geometry, opts = {}) {
    Object.assign(this, opts);
    this.uid = G.UID++;
    this.needsUpdate = false;
    this.parent = null;
    this.renderCache = {};
    this.geometry = geometry;
    this.position = opts.position
      ? new Point(
          opts.position.x || 0,
          opts.position.y || 0,
          opts.position.z || 0
        )
      : new Point(0, 0, 0);
    this.rotation = opts.rotation
      ? new Point(
          opts.rotation.x || 0,
          opts.rotation.y || 0,
          opts.rotation.z || 0
        )
      : new Point(0, 0, 0);
    this.scale = this.scale
      ? new Point(opts.scale.x || 1, opts.scale.y || 1, opts.scale.z || 1)
      : new Point(1, 1, 1);
  }

  getPosition() {
    if (this.parent) {
      const parentPosition = this.parent.getPosition();
      return new Point(
        parentPosition.x + this.position.x,
        parentPosition.y + this.position.y,
        parentPosition.z + this.position.z
      );
    } else {
      return this.rotation;
    }
  }

  getRotation() {
    if (this.parent) {
      const parentRotation = this.parent.getRotation();
      return new Point(
        parentRotation.x + this.rotation.x,
        parentRotation.y + this.rotation.y,
        parentRotation.z + this.rotation.z
      );
    } else {
      return this.rotation;
    }
  }

  getScale() {
    if (this.parent) {
      const parentScale = this.parent.getScale();
      return new Point(
        parentScale.x + this.scale.x,
        parentScale.y + this.scale.y,
        parentScale.z + this.scale.z
      );
    } else {
      return this.scale;
    }
  }

  render(event, camera, iso = G.ISO) {
    if (this.updatesOn.includes('mouse')) {
      console.log(this.updatesOn);
    }
    if (
      !event ||
      this.needsUpdate ||
      (this.updatesOn && this.updatesOn.includes(event))
    ) {
      this.style && this.style.apply();
      camera.project(this, iso);
      this.parent.style && this.parent.style.apply();
    }
  }
}
