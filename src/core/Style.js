import { G } from '../globals';

export class Style {
  constructor(styles) {
    Object.assign(this, { styles });
  }
  apply() {
    this.styles.forEach((style) => {
      const [name, prop] = style;
      G.CTX[name] = typeof prop === 'function' ? prop() : prop;
    });
  }
}
