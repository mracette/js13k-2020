import { G } from '../globals';
import { isoToMap, orthoToMap, pageToCanvas } from '../utils/conversions';

export const updateMouseHoverTile = (e, iso = G.ISO) => {
  const [cx, cy] = pageToCanvas(e);
  const [mx, my] = iso ? isoToMap(cx, cy, false) : orthoToMap(cx, cy, false);
  G.MOUSE_HOVER.x = Math.floor(mx);
  G.MOUSE_HOVER.y = Math.floor(my);
};
