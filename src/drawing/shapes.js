import { G } from '../globals';

export const drawLines = (lines, fill = false, ctx) => {
  ctx.beginPath();
  lines.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  fill && ctx.fill();
  ctx.stroke();
};

export const drawFaces = (faces, fill = false, ctx, boxToOrigin = false) => {
  const xAdj = boxToOrigin ? -1 * boxToOrigin[0] : 0;
  const yAdj = boxToOrigin ? -1 * boxToOrigin[1] : 0;
  ctx.beginPath();
  faces.forEach((face) => {
    face.forEach((point, i) => {
      if (i === 0) {
        console.log(boxToOrigin, point.x + xAdj, point.y + yAdj);
        ctx.moveTo(point.x + xAdj, point.y + yAdj);
      } else {
        ctx.lineTo(point.x + xAdj, point.y + yAdj);
      }
    });
  });
  fill && ctx.fill();
  ctx.stroke();
};
