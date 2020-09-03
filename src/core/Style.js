import { G } from '../globals';

export class Style {
  constructor(styles, uid) {
    this.uid = uid || G.UID++;
    this.styles = styles;
  }
  apply(ctx = G.CTX) {
    for (const [key, value] of Object.entries(this.styles)) {
      ctx[key] = typeof value === 'function' ? value() : value;
    }
  }
}
