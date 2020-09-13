import { Rx, Ry, Rz } from '../core/Matrix';

export const PI = Math.PI;
export const TAU = Math.PI * 2;

// TODO: cut some params here
export const boundedSin = (
  period = 1,
  yMin = -1,
  yMax = 1,
  translateX = 0,
  translateY = 0
) => {
  return (x) =>
    yMin +
    (yMax - yMin) *
      (0.5 + Math.sin(-translateX + (Math.PI * x) / (period / 2)) / 2) +
    translateY;
};

export const rotatePoint = (px, py, cx, cy, angle) => {
  return {
    x: Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
    y: Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
  };
};

export const degToRad = (deg) => (deg * Math.PI) / 180;

export const rotate3d = (point, axis, amount, inverse) => {
  let rot;
  let xx, yy, zz;
  if (axis === 'x') {
    rot = Rx.get(amount, inverse);
  } else if (axis === 'y') {
    rot = Ry.get(amount, inverse);
  } else if (axis === 'z') {
    rot = Rz.get(amount, inverse);
  }
  rot.forEach((row, i) => {
    let total = 0;
    total += row[0] * point.x;
    total += row[1] * point.y;
    total += row[2] * point.z;
    if (i === 0) {
      xx = total;
    } else if (i === 1) {
      yy = total;
    } else {
      zz = total;
    }
  });
  point.x = xx;
  point.y = yy;
  point.z = zz;
};
