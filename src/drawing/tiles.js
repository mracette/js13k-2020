import { G } from '../globals';
import { MOUSE_HOVER } from '../state/screen';
import { mapToIso, mapToOrtho } from '../utils/conversions';
import { drawBox } from '../drawing/shapes';

export const setStyles = () => {
  G.CTX.strokeStyle = 'white';
  G.CTX.lineWidth = G.COORDS.SCREEN.getWidth() * 0.0005;
  G.CTX.fillStyle = 'black';
};

export const drawTileOutlines = (iso = G.ISO) => {
  for (let i = 0; i < G.SCREEN_TILES; i++) {
    for (let j = 0; j < G.SCREEN_TILES; j++) {
      drawBox(i, j, 1, 1, true, false, iso);
    }
  }
};

export const drawPathToHover = (iso = G.ISO) => {
  G.CTX.fillStyle = G.COLORS.WHITE_OVERLAY_02;
  const path = G.PATHS.PLAYER_TO_HOVER;
  const length = path.length;
  if (length) {
    path.forEach((node, i) => {
      if (i === length - 1) G.CTX.fillStyle = G.COLORS.EMERALD_GREEN;
      drawBox(node.x, node.y, 1, 1, false, true, iso);
    });
  }
};
