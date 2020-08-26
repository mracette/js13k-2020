import { G } from '../globals';
import { Vector3 } from './Vector3';
import { Entity } from './Entity';

export class Group extends Entity {
  constructor(children, opts = {}) {
    super(opts);
    const defaults = {
      type: 'group',
      autoCache: true,
      style: null,
      children: []
    };
    Object.assign(this, { ...defaults, ...opts });
    children && this.add(children);
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
        return this.getChild(child.children);
      }
    });
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

  render(camera, ctx, iso = G.ISO) {
    if (this.enabled || this.needsUpdate) {
      this.style && this.style.apply();
      this.children.forEach((child) => child.render(camera, ctx, iso));
    }
  }
}
