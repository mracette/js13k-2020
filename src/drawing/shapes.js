import { G } from '../globals';
import { box } from '../generative/shapes';
import { mapToIso, mapToOrtho } from '../utils/conversions';

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

export const drawBox = (
  x,
  y,
  w,
  h,
  stroke = true,
  fill = false,
  iso = G.ISO
) => {
  drawLines(
    box(x, y, w, h).map((point) =>
      iso ? mapToIso(...point) : mapToOrtho(...point)
    ),
    stroke,
    fill
  );
};
