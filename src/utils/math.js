import { Rx, Ry, Rz } from '../core/Matrix';

export const nearestPow2 = (size) => {
  return Math.pow(2, Math.round(Math.log(size) / Math.log(2)));
};

export const degToRad = (deg) => (deg * Math.PI) / 180;
export const radToDeg = (rad) => (rad * 180) / Math.PI;

export const rotateVector3 = (px, py, cx, cy, angle) => {
  return [
    Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
    Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy
  ];
};

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
