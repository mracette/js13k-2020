import { G } from '../globals';
import { isoToMap, orthoToMap, pageToCanvas } from '../utils/conversions';

export const MOUSE_HOVER_TILE = [null, null];

export const updateMouseHoverTile = (e, iso = G.ISO) => {
  const [cx, cy] = pageToCanvas(e);
  const [mx, my] = iso ? isoToMap(cx, cy, false) : orthoToMap(cx, cy, false);
  MOUSE_HOVER_TILE[0] = Math.floor(mx);
  MOUSE_HOVER_TILE[1] = Math.floor(my);
};
