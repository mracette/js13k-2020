import { G } from '../globals';
import { Vector3 } from '../core/Vector3';
import { TAU } from '../utils/math';

const BREAKS_DURATION = 1000;
let ID = 0;

export class Action {
  constructor(start, type, row, col, params = {}, ctx = G.CTX) {
    const [x, y] = G.MAP.getTileFromGrid(row, col);
    Object.assign(this, { start, type, ctx, row, col, x, y, ...params });
    this.id = ID++;
    switch (type) {
      case 'breaks': {
        this.pieces = Array(10)
          .fill()
          .map(() => -0.5 + Math.random());
        break;
      }
    }
  }
  render(time) {
    const p = G.CAMERA.project(new Vector3(this.x + 0.5, this.y + 0.5, 0));
    this.ctx.save();
    switch (this.type) {
      case 'breaks':
        this.renderBreak(time, p.x, p.y);
        break;
      case 'gold':
        this.renderGold(time, p.x, p.y);
        break;
      default:
        break;
    }
    this.ctx.restore();
  }
  renderBreak(time, cx, cy) {
    this.ctx.save();
    const delta = (time - this.start) / BREAKS_DURATION;
    if (delta > 1) {
      G.MAP.removeAction(this.id);
    }
    this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - delta})`;
    for (let i = 0; i < 5; i++) {
      this.ctx.beginPath();
      this.ctx.arc(
        cx + (delta * G.COORDS.width() * this.pieces[i]) / 10,
        cy + (delta * G.COORDS.height() * this.pieces[i + 1]) / 10,
        5,
        0,
        TAU
      );
      this.ctx.closePath();
      this.ctx.fill();
    }
    this.ctx.restore();
  }
  renderGold(time, cx, cy) {
    this.ctx.save();
    const delta = (time - this.start) / BREAKS_DURATION;
    if (delta > 1) {
      G.MAP.removeAction(this.id);
    }
    this.ctx.fillStyle = 'gold';
    this.ctx.beginPath();
    this.ctx.fillText(
      '+' + this.amount,
      cx + G.COORDS.width(0.02),
      cy - Math.min(1, delta * 2) * G.COORDS.height(0.1)
    );
    this.ctx.arc(
      cx,
      cy - Math.min(1, delta * 2) * G.COORDS.height(0.1),
      G.COORDS.height(0.02),
      0,
      TAU
    );
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }
}
