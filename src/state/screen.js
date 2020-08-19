import { G } from '../globals';
import { pageToCanvas } from '../utils/conversions';
import { Vector3 } from '../core/Vector3';

export const updateMouseHoverTile = (e) => {
  const oldX = G.MOUSE_HOVER.x;
  const oldY = G.MOUSE_HOVER.y;
  const [cx, cy] = pageToCanvas(e);
  const map = G.CAMERA.unproject(new Vector3(cx, cy, 0));
  G.MOUSE_HOVER.x = Math.floor(map.x);
  G.MOUSE_HOVER.y = Math.floor(map.y);
  return oldX !== G.MOUSE_HOVER.x || oldY !== G.MOUSE_HOVER.y;
};
