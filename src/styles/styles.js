import { G } from '../globals';
import { Style } from '../core/Style';

export class TileStyle extends Style {
  constructor() {
    super([
      ['strokeStyle', 'white'],
      ['lineWidth', () => G.COORDS.SCREEN.getWidth() * 0.0005],
      ['fillStyle', 'black']
    ]);
  }
}
