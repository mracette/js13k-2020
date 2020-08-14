import { G } from '../globals';
import { PLAYER } from '../state/player';
import { drawBox } from '../drawing/shapes';

export const drawPlayer = () => {
  G.CTX.fillStyle = G.COLORS.LILAC;
  drawBox(PLAYER.position.x, PLAYER.position.y, 1, 1, true, true);
};
