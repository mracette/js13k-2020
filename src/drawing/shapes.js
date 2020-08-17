import { G } from '../globals';

export const drawLines = (lines, close = false, fill = false) => {
  G.CTX.beginPath();
  lines.forEach((point, i) => {
    if (i === 0) {
      G.CTX.moveTo(point.x, point.y);
    } else {
      G.CTX.lineTo(point.x, point.y);
    }
  });
  close && G.CTX.closePath();
  fill && G.CTX.fill();
  G.CTX.stroke();
};
