import { G } from '../globals';
import { pageToCanvas } from '../utils/conversions';
import { Point } from '../core/Point';

export const updateMouseHoverTile = (e) => {
  const [cx, cy] = pageToCanvas(e);
  const map = G.CAMERA.unproject(new Point(cx, cy, 0));
  G.MOUSE_HOVER.x = Math.floor(map.x);
  G.MOUSE_HOVER.y = Math.floor(map.y);
};
