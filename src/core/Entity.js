import { G } from '../globals';
import { Vector3 } from './Vector3';

export class Entity {
  constructor(opts = {}) {
    const defaults = {
      enabled: true,
      needsUpdate: null,
      position: new Vector3(0, 0, 0),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    };
    this.uid = opts.uid || G.UID++;
    Object.assign(this, { ...defaults, ...opts });
  }

  getPosition() {
    if (this.parent) {
      const parentPosition = this.parent.getPosition();
      return new Vector3(
        parentPosition.x + this.position.x,
        parentPosition.y + this.position.y,
        parentPosition.z + this.position.z
      );
    } else {
      return this.position;
    }
  }

  getRotation() {
    if (this.parent) {
      const parentRotation = this.parent.getRotation();
      return new Vector3(
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
      return new Vector3(
        parentScale.x + this.scale.x,
        parentScale.y + this.scale.y,
        parentScale.z + this.scale.z
      );
    } else {
      return this.scale;
    }
  }
}
