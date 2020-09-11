import { G } from '../globals';
import { Vector3 } from './Vector3';

export class Entity {
  constructor(opts = {}) {
    const defaults = {
      enabled: true,
      position: new Vector3(0, 0, 0),
      rotation: new Vector3(0, 0, 0),
      scale: new Vector3(1, 1, 1)
    };
    this.uid = G.UID++;
    Object.assign(this, { ...defaults, ...opts });
  }

  getStyleList() {
    let list = [];
    let obj = this;
    while (obj) {
      if (obj.style) {
        if (Array.isArray(obj.style)) {
          // order is important so that child styles overrider parent styles
          list = [...obj.style, ...list];
        } else {
          list.unshift(obj.style);
        }
      }
      obj = obj.parent || null;
    }
    return list;
  }

  applyAllStyles(ctx = G.CTX) {
    this.getStyleList().forEach((s) => s.apply(ctx));
  }

  getEnabled() {
    if (this.parent) {
      const parentEnabled = this.parent.getEnabled();
      return parentEnabled && this.enabled;
    } else {
      return this.enabled;
    }
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
    if (this.parent && this.parent.scale) {
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
