import { G } from '../globals';
import { degToRad, rotate3d } from '../utils/math';
import { Vector3 } from './Vector3';
import { Entity } from './Entity';

export class Camera extends Entity {
  constructor(opts) {
    super(opts);
    const defaults = { magnification: 12 };
    Object.assign(this, { ...defaults, ...opts });
    this._cache = {};
  }

  clearCache() {
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
    return G.COORDS.width() / (x1.x - x0.x);
  }

  getVisibleMapHeight() {
    // how many map units fit across the height of the canvas?
    const y0 = new Vector3(0, 0, 0);
    const y1 = new Vector3(0, 1, 0);
    this.project(y0);
    this.project(y1);
    return G.COORDS.height() / (y1.y - y0.y);
  }

  mapToScreen(point) {
    // how many map units fit across the height of the canvas?
    const scale = G.COORDS.height() / (this.magnification || 1);
    point.x = G.COORDS.nx(0) + point.x * scale;
    point.y = G.COORDS.ny(0) + point.y * scale;
    point.z = 0;
  }

  screenToMap(point) {
    const scale = G.COORDS.height() / (this.magnification || 1);
    point.x = (point.x - G.COORDS.nx(0)) / scale;
    point.y = (point.y - G.COORDS.ny(0)) / (scale / 4);
    point.z = 0;
  }

  projectTransform(point) {
    // shift according to position of camera;
    point.x -= this.position.x;
    point.y -= this.position.y;
    // apply rotations
    rotate3d(point, 'z', degToRad(45));
    rotate3d(point, 'x', degToRad(60));
    // transform to screen coordinates
    this.mapToScreen(point);
  }

  /**
   * @param {Array} box - the objects bounding box [x0, y0, x1, y1]
   * @param {Vector3} lowerBound - the baseline of the bounding box
   * @param {Vector3} point - new point to consider
   */
  updateBoundingBox(box, lowerBound, point) {
    if (!box[2] || point.x > box[2]) {
      box[2] = point.x;
    }
    if (!box[3] || point.y > box[3]) {
      // here the bounding lower bound is enforced for "floating" objects
      // (on the max y of the bounding box due to the y-down convention)
      box[3] = Math.max(point.y, lowerBound.y);
    }
    if (point.x < box[0] || !box[0]) {
      box[0] = point.x;
    }
    if (point.y < box[1] || !box[1]) {
      box[1] = point.y;
    }
  }

  /**
   * @param {Object} object either a mesh or point to project
   * @param {boolean} bounding if projecting a mesh, setting to true will
   * update its bounding box during the projection
   * @returns {Array} returns an array of faces and normals that can be passed
   * directly to this.drawLines()
   */
  project(object, bounding = true) {
    // if the projected object is a mesh, the objects transformations must
    // be baked into the geometry before it is projected to the screen
    if (object.type === 'mesh') {
      const scale = object.getScale();
      const rotation = object.getRotation();
      const position = object.getPosition();
      // use a copy to avoid modifying geometry
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
          point.translate(position);
          // reassign
          face[j] = point;
        }
      }
      // after the object translation, but before the camera projection,
      // we sort the faces so they are display back-to-front. we need to keep
      // track of which normals correspond to which face as well, so we must combine them
      const normals = object.geometry.getNormals();
      let facesAndNormals = faceCopy.map((face, i) => {
        return {
          face,
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
        return aAvg < bAvg ? -1 : 1;
      });
      // we can also limit the render to just faces that the camera sees
      facesAndNormals = facesAndNormals.filter((face) => {
        return face.normal[0] >= -degToRad(45) && face.normal[1] >= 0;
      });

      // when we're updating the bounding box, we need to account for the
      // space in between the *bottom* (+1, +1) of the tile and the first line moving
      // up (basically if something is "floating"). otherwise it won't render
      // correctly off the cache
      let boundingLowerBound, box;
      if (bounding) {
        box = object.box;
        boundingLowerBound = object
          .getPosition()
          .clone()
          .translate(new Vector3(1, 1, 0));
        this.projectTransform(boundingLowerBound);
      }

      // final transformation is to use the camera projection
      for (let i = 0; i < facesAndNormals.length; i++) {
        const face = facesAndNormals[i].face;
        for (let j = 0; j < face.length; j++) {
          const point = face[j];
          this.projectTransform(point);
          // update the bounding box if necessary (yes for each point)
          if (bounding) {
            this.updateBoundingBox(box, boundingLowerBound, point);
          }
        }
      }

      return facesAndNormals;
      // if (bounding) {
      //   // account for line width in bounding box
      //   const lw = parseFloat(ctx.lineWidth || 0);
      //   bounding[0] -= lw / 2;
      //   bounding[1] -= lw / 2;
      //   bounding[2] += lw / 2;
      //   bounding[3] += lw / 2;
      // }
      // if (boxToOrigin) {
      //   this.drawFaces(facesAndNormals, ctx, bounding);
      // } else {
      //   this.drawFaces(facesAndNormals, ctx);
      // }
    } else if (object.type === 'point') {
      // the projection of a point is much simpler, just use the camera's transforms
      this.projectTransform(object);
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

  drawFaces(faces, ctx, box = false, opts = {}) {
    const fill = opts.fill || true;
    const stroke = opts.stroke || true;
    const shade = opts.shade || true;
    const xAdj = box ? -1 * box[0] : 0;
    const yAdj = box ? -1 * box[1] : 0;
    faces.forEach((face) => {
      const thetaAdjust = face.normal[0] / Math.PI;
      const phiAdjust = face.normal[1] / Math.PI;
      ctx.beginPath();
      face.face.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x + xAdj, point.y + yAdj);
        } else {
          ctx.lineTo(point.x + xAdj, point.y + yAdj);
        }
      });
      // always close the path
      ctx.closePath();
      if (fill) {
        // save the base styles and apply them to the face
        ctx.save();
        ctx.fill();
        if (shade) {
          // use a darkened layer for flat shading
          ctx.fillStyle = `rgba(0, 0, 0, ${
            thetaAdjust * 0.5 + phiAdjust * 0.5
          })`;
          ctx.fill();
        }
        // restore for next iteration
        ctx.restore();
      }
      // apply stroke if needed
      if (stroke) {
        ctx.stroke();
      }
    });
  }
}
