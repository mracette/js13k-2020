import { G } from '../globals';
import { degToRad, rotate3d } from '../utils/math';
import { drawFaces } from '../drawing/shapes';
import { Vector3 } from './Vector3';
import { Entity } from './Entity';
// import { Log } from '../core/Logger';

export class Camera extends Entity {
  constructor(opts) {
    super(opts);
    const defaults = { magnification: 12 };
    Object.assign(this, { ...defaults, ...opts });
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
      const scale = object.getScale();
      const normals = object.geometry.getNormals();
      const faceCopy = [...object.geometry.getFaces()];
      for (let i = 0; i < faceCopy.length; i++) {
        const face = faceCopy[i];
        for (let j = 0; j < face.length; j++) {
          const point = face[j];
          // apply object scaling
          point.x *= scale.x;
          point.y *= scale.y;
          point.z *= scale.z;
          // apply object rotations
          rotation.x && rotate3d(point, 'x', rotation.x);
          rotation.y && rotate3d(point, 'y', rotation.y);
          rotation.z && rotate3d(point, 'z', rotation.z);
          // apply object translation
          point.translate(object.getPosition());
          // reassign
          face[j] = point;
        }
      }
      // after the object translation, but before the camera projection,
      // we sort the faces so they display back-to-front. we need to keep
      // track of which normals correspond to which face as well, so we must
      // combine them
      let facesAndNormals = faceCopy.map((face, i) => {
        return {
          face: face,
          normal: normals[i]
        };
      });
      facesAndNormals.sort((a, b) => {
        const aAvg =
          a.face.map((v) => v.x + v.y + v.z).reduce((a, b) => a + b) /
          a.face.length;
        const bAvg =
          b.face.map((v) => v.x + v.y + v.z).reduce((a, b) => a + b) /
          b.face.length;
        console.log(a, b);
        if (aAvg < bAvg) {
          return -1;
        } else {
          return 1;
        }
      });
      // only render faces that face the camera
      facesAndNormals = facesAndNormals.filter((face) => {
        return face.normal[0] >= 0 && face.normal[1] >= 0;
      });
      console.log(facesAndNormals);
      // final transformation is to use the camera projection
      for (let i = 0; i < facesAndNormals.length; i++) {
        const face = facesAndNormals[i].face;
        for (let j = 0; j < face.length; j++) {
          const point = face[j];
          this.projectTransform(point, iso);
          // update the bounding box if necessary (yes for each point)
          if (bounding) {
            (!bounding[2] || point.x > bounding[2]) && (bounding[2] = point.x);
            (!bounding[3] || point.y > bounding[3]) && (bounding[3] = point.y);
            if (point.x < bounding[0] || !bounding[0]) {
              bounding[0] = point.x;
            }
            if (point.y < bounding[1] || !bounding[1]) {
              bounding[1] = point.y;
            }
          }
        }
      }
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
        drawFaces(facesAndNormals, fill, ctx, bounding);
      } else {
        drawFaces(facesAndNormals, fill, ctx);
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
