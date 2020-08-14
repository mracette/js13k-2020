import { G } from '../globals';

import { MOUSE_HOVER_TILE } from '../state/screen';
import { mapToScreen, orthoToIso } from '../utils/conversions';

export const drawLines = (lines, close = false, fill = false) => {
  G.CTX.beginPath();
  lines.forEach((line, i) => {
    const [x, y] = line;
    console.log(x, y);
    if (i === 0) {
      G.CTX.moveTo(x, y);
    } else {
      G.CTX.lineTo(x, y);
    }
  });
  close && G.CTX.closePath();
  fill && G.CTX.fill();
  G.CTX.stroke();
};

export const setStyles = () => {
  G.CTX.strokeStyle = 'white';
  G.CTX.lineWidth = G.COORDS.SCREEN.getWidth() * 0.0005;
  G.CTX.fillStyle = 'black';
};

export const drawTiles = (iso = true) => {
  // const [ax, ay] = MOUSE_HOVER_TILE;
  console.log(G.ORTHO_TILE_WIDTH, G.ORTHO_TILE_HEIGHT);
  for (let i = 0; i < G.SCREEN_TILES; i++) {
    for (let j = 0; j < G.SCREEN_TILES; j++) {
      const cx = G.COORDS.SCREEN.nx(-0.5) + i * G.ORTHO_TILE_WIDTH;
      const cy = G.COORDS.SCREEN.ny(-1) + j * G.ORTHO_TILE_HEIGHT;
      const points = [
        [cx, cy],
        [cx + G.ORTHO_TILE_WIDTH, cy],
        [cx + G.ORTHO_TILE_WIDTH, cy + G.ORTHO_TILE_HEIGHT],
        [cx, cy + G.ORTHO_TILE_HEIGHT],
        [cx, cy]
      ];
      if (iso) {
        drawLines(
          points.map((point) => orthoToIso(...point)),
          false,
          false
        );
      } else {
        drawLines(points, false, false);
      }
    }
  }
};

// export const drawIsoTiles = () => {
//   const [ax, ay] = MOUSE_HOVER_TILE;
//   console.log(ax, ay);
//   const nx = 10;
//   const ny = 10;
//   const sx = SCREEN.getWidth() / nx;
//   const sy = sx / 2;
//   const ss = sy / 2;
//   for (let i = 0; i < nx; i++) {
//     for (let j = 0; j < ny; j++) {
//       const cx = SCREEN.nx(-1) + sy + i * sy + j * sy;
//       const cy = SCREEN.ny(0) - i * ss + j * ss;
//       const p1 = [cx - sx / 2, cy];
//       const p2 = [cx, cy - sy / 2];
//       const p3 = [cx + sx / 2, cy];
//       const p4 = [cx, cy + sy / 2];
//       const mouse = i === ax && j === ay;
//       drawLines([p1, p2, p3, p4], true, mouse);
//     }
//   }
// };
