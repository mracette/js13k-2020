import { G } from '../globals';
import { degToRad, rotate3d } from '../utils/math';
import { drawLines } from '../drawing/shapes';
import { Point } from '../core/Point';

export class Camera {
  /**
   * @param {Point} position
   * @param {object} frustrum
   * @param {number} frustrum.left
   * @param {number} frustrum.right
   * @param {number} frustrum.top
   * @param {number} frustrum.bottom
   * @param {object} scale
   * @param {number} scale.x
   * @param {number} scale.y
   * @param {number} magnification
   */
  constructor(opts) {
    Object.assign(this, opts);
  }

  mapToScreen(point) {
    const scale = G.COORDS.SCREEN.getHeight() / (this.magnification || 1);
    return new Point(
      G.COORDS.SCREEN.nx(0) + point.x * scale,
      G.COORDS.SCREEN.ny(0) + point.y * scale,
      0
    );
  }

  screenToMap(point) {
    const scale = G.COORDS.SCREEN.getHeight() / (this.magnification || 1);
    return new Point(
      (point.x - G.COORDS.SCREEN.nx(0)) / scale,
      (point.y - G.COORDS.SCREEN.ny(0)) / (scale / 4),
      0
    );
  }

  project(object, iso = G.ISO) {
    // isometric camera rotations
    console.log(object);
    object.geometry.forEach((face) => {
      const newFace = [];
      face.forEach((point) => {
        point = point.translate(object.getPosition());
        // shift according to position of camera;
        point.x += -1 * this.position.x;
        point.y += -1 * this.position.y;
        if (iso) {
          point = rotate3d(point, 'z', degToRad(45));
          point = rotate3d(point, 'x', degToRad(60));
        }
        point = this.mapToScreen(point);
        newFace.push(point);
      });
      drawLines(newFace, false, true);
    });
  }

  unproject(point, iso = G.ISO) {
    point = this.screenToMap(point);
    if (iso) {
      point = rotate3d(point, 'x', degToRad(60), true);
      point = rotate3d(point, 'z', degToRad(45), true);
    }
    point.x += 1 * this.position.x;
    point.y += 1 * this.position.y;
    return point;
  }
}
