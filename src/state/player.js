import { G } from '../globals';
import { isoToMap, orthoToMap, pageToCanvas } from '../utils/conversions';

export const PLAYER = [9, 9];

export const updatePlayerPosition = (e, iso = G.ISO) => {
  const [cx, cy] = pageToCanvas(e);
  const [mx, my] = iso ? isoToMap(cx, cy, false) : orthoToMap(cx, cy, false);
  PLAYER[0] = Math.floor(mx);
  PLAYER[1] = Math.floor(my);
};
