import { G } from '../globals';
import { MOUSE_HOVER_TILE } from '../state/screen';
import { mapToIso, mapToOrtho } from '../utils/conversions';
import { drawBox } from '../drawing/shapes';

export const drawLines = (lines, close = false, fill = false) => {
  // console.log(lines);
  G.CTX.beginPath();
  lines.forEach((line, i) => {
    const [x, y] = line;
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

export const drawTiles = () => {
  const [ax, ay] = MOUSE_HOVER_TILE;
  console.log(ax, ay);
  for (let i = 0; i < G.SCREEN_TILES; i++) {
    for (let j = 0; j < G.SCREEN_TILES; j++) {
      const mouseOver = ax === i && ay === j;
      drawBox(i, j, 1, 1, true, mouseOver);
    }
  }
};
