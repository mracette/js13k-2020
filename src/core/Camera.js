import { G } from '../globals';
import { degToRad, rotate3d } from '../utils/math';
import { drawLines, drawFaces } from '../drawing/shapes';
import { Vector3 } from '../core/Vector3';
// import { Log } from '../core/Logger';

export class Camera {
  constructor(opts) {
    Object.assign(this, opts);
    this._cache = {};
  }

  getCache(key) {
    return this._cache.hasOwnProperty(key) && this._cache[key];
  }

  setCache(key, image) {
    this._cache[key] = image;
  }

  getVisibleMapWidth() {
    // how many map units fit across the width of the canvas?
    const x0 = new Vector3(0, 0, 0);
    const x1 = new Vector3(1, 0, 0);
    this.project(x0);
    this.project(x1);
    return G.COORDS.SCREEN.getWidth() / (x1.x - x0.x);
  }

  isObjectVisible(object) {
    if (object.type === 'point') {
      const clone = object.clone();
      this.project(clone);
      return (
        clone.x > 0 &&
        clone.y > 0 &&
        clone.x < G.COORDS.SCREEN.getWidth() * 0.98 &&
        clone.y < G.COORDS.SCREEN.getHeight() * 0.95
      );
    }
    // const objPos = object.getPosition();
    // const xDiff = Math.abs(objPos - this.position.x);
    // const mapWidth = this.getMapWidth();
    // if xF
  }

  getVisibleMapHeight() {
    // how many map units fit across the height of the canvas?
    const y0 = new Vector3(0, 0, 0);
    const y1 = new Vector3(0, 1, 0);
    this.project(y0);
    this.project(y1);
    return G.COORDS.SCREEN.getHeight() / (y1.y - y0.y);
  }

  mapToScreen(point) {
    // how many map units fit across the height of the canvas?
    const scale = G.COORDS.SCREEN.getHeight() / (this.magnification || 1);
    point.x = G.COORDS.SCREEN.nx(0) + point.x * scale;
    point.y = G.COORDS.SCREEN.ny(0) + point.y * scale;
    point.z = 0;
  }

  screenToMap(point) {
    const scale = G.COORDS.SCREEN.getHeight() / (this.magnification || 1);
    point.x = (point.x - G.COORDS.SCREEN.nx(0)) / scale;
    point.y = (point.y - G.COORDS.SCREEN.ny(0)) / (scale / 4);
    point.z = 0;
  }

  projectTransform(point, iso) {
    // shift according to position of camera;
    point.x -= this.position.x;
    point.y -= this.position.y;
    // apply rotations
    if (iso) {
      rotate3d(point, 'z', degToRad(45));
      rotate3d(point, 'x', degToRad(60));
    }
    this.mapToScreen(point);
  }

  project(object, iso = G.ISO, ctx, bounding, fill = true, boxToOrigin = true) {
    // isometric camera rotations
    if (object.type === 'mesh') {
      const rotation = object.getRotation();
      const newFaces = [];
      object.geometry.faces.forEach((face) => {
        const newFace = [];
        face.forEach((point) => {
          // create a clone so we don't modify the geometry
          const projected = point.clone();
          // apply object rotations
          rotation.x && rotate3d(projected, 'x', rotation.x);
          rotation.y && rotate3d(projected, 'y', rotation.y);
          rotation.z && rotate3d(projected, 'z', rotation.z);
          // account for object position
          projected.translate(object.getPosition());
          // account for camera angle and position
          this.projectTransform(projected, iso);
          // add back point
          newFace.push(projected);
          // update the bounding box if needed
          if (bounding) {
            (!bounding[2] || projected.x > bounding[2]) &&
              (bounding[2] = projected.x);
            (!bounding[3] || projected.y > bounding[3]) &&
              (bounding[3] = projected.y);
            if (projected.x < bounding[0] || !bounding[0]) {
              bounding[0] = projected.x;
            }
            if (projected.y < bounding[1] || !bounding[1]) {
              bounding[1] = projected.y;
            }
          }
        });
        newFaces.push(newFace);
      });
      if (bounding) {
        // account for line width in bounding box
        const lw = parseFloat(ctx.lineWidth || 0);
        bounding[0] -= lw;
        bounding[2] -= lw;
        bounding[1] += lw;
        bounding[3] += lw;
        G.LOGGER.debug(`set bounding to: ${bounding.flat()}`);
      }
      if (boxToOrigin) {
        drawFaces(newFaces, fill, ctx, bounding);
      } else {
        drawFaces(newFaces, fill, ctx);
      }
    } else if (object.type === 'point') {
      this.projectTransform(object, iso);
    }
  }

  unproject(point, iso = G.ISO) {
    this.screenToMap(point);
    if (iso) {
      rotate3d(point, 'x', degToRad(60), true);
      rotate3d(point, 'z', degToRad(45), true);
    }
    point.x += 1 * this.position.x;
    point.y += 1 * this.position.y;
    return point;
  }
}
