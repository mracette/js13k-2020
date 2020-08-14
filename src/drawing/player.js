import { G } from '../globals';
import { PLAYER } from '../state/player';
import { drawBox } from '../drawing/shapes';

export const drawPlayer = () => {
  G.CTX.fillStyle = G.COLORS.LILAC;
  drawBox(PLAYER[0], PLAYER[1], 1, 1, true, true);
};
