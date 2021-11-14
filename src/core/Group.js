import { Entity } from './Entity';

export class Group extends Entity {
  constructor(children, opts = {}) {
    super(opts);
    const defaults = {
      type: 'group',
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
      if (this.children[count].uid === object.uid) {
        index = count;
      } else {
        count++;
      }
    }
    if (index !== null) {
      this.children.splice(index, 1);
    }
  }

  render(camera, ctx) {
    if (this.enabled || this.needsUpdate) {
      ctx.save();
      this.applyAllStyles(ctx);
      this.children.forEach((child) => child.render(camera, ctx));
      ctx.restore();
    }
  }
}
