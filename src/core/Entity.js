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
    this.uid = G.UID++;
    Object.assign(this, { ...defaults, ...opts });
  }

  getStyleList() {
    const list = [];
    let obj = this;
    while (obj) {
      obj.style && list.push(obj.style);
      obj = obj.parent || null;
    }
    return list;
  }

  isAutoCached() {
    return this.autoCache || (this.parent && this.parent.isAutoCached());
  }

  getPosition() {
    if (this.parent) {
      const parentPosition = this.parent.getPosition();
      return parentPosition.clone().translate(this.position);
    } else {
      return this.position;
    }
  }

  getRotation() {
    if (this.parent) {
      const parentRotation = this.parent.getRotation();
      return parentRotation.clone().translate(this.rotation);
    } else {
      return this.rotation;
    }
  }

  getScale() {
    if (this.parent) {
      const parentScale = this.parent.getScale();
      return new Vector3(
        parentScale.x * this.scale.x,
        parentScale.y * this.scale.y,
        parentScale.z * this.scale.z
      );
    } else {
      return this.scale;
    }
  }
}
