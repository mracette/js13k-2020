import { G } from '../globals';
import { Point } from './Point';

export class Group {
  constructor(opts = {}) {
    Object.assign(this, opts);
    this.uid = G.UID++;
    this.needsUpdate = this.parent = null;
    this.children = [];
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

  add(object) {
    if (Array.isArray(object)) {
      object.forEach((o) => {
        this.children.push(o);
        o.parent = this;
      });
    } else {
      this.children.push(object);
      object.parent = this;
    }
  }

  remove(object) {
    let index = null;
    let count = 0;
    while (index === null && count < this.children.length) {
      if (this.children[index].uid === object.uid) {
        index = count;
      } else {
        count++;
      }
    }
    if (index !== null) {
      this.children.splice(index, 1);
    }
  }

  getChild(uid, children = null) {
    const list = children || this.children;
    list.forEach((child) => {
      if (child.uid === uid) {
        return child;
      }
      if (child.children && child.children.length) {
        this.getChild(child.children);
      }
    });
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
    if (
      !event ||
      this.needsUpdate ||
      (this.updatesOn && this.updatesOn.includes(event))
    ) {
      this.style && this.style.apply();
      this.children.forEach((child) => child.render(event, camera, iso));
    }
  }
}
