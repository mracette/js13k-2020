import { G } from '../globals';

export const drawFaces = (
  faces,
  fill = false,
  ctx,
  boxToOrigin = false,
  sort = true
) => {
  const xAdj = boxToOrigin ? -1 * boxToOrigin[0] : 0;
  const yAdj = boxToOrigin ? -1 * boxToOrigin[1] : 0;
  faces.forEach((face, i) => {
    const thetaAdjust = face.normal[0] / Math.PI;
    const phiAdjust = face.normal[1] / Math.PI;
    console.log(face.face, face.normal, thetaAdjust, phiAdjust);
    ctx.beginPath();
    face.face.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x + xAdj, point.y + yAdj);
      } else {
        ctx.lineTo(point.x + xAdj, point.y + yAdj);
      }
    });
    ctx.closePath();
    if (fill) {
      const baseStyle = ctx.fillStyle;
      ctx.fill();
      ctx.fillStyle = `rgba(0, 0, 0, ${thetaAdjust * 0.5 + phiAdjust * 0.5})`;
      ctx.fill();
      ctx.fillStyle = baseStyle;
    }
    ctx.stroke();
  });
};
