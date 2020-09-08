import { G } from '../globals';
import { Vector3 } from './Vector3';
import { Entity } from './Entity';

export class Mesh extends Entity {
  constructor(geometry, opts = {}) {
    super(opts);
    const defaults = {
      type: 'mesh',
      uid: G.UID++,
      style: null,
      cacheEnabled: true,
      box: [] // x0, y0, x1, y1
    };
    this.stylesId = this.getStyleList()
      .map((s) => s.uid)
      .join('-');
    Object.assign(this, { geometry, ...defaults, ...opts });
  }

  getKey() {
    // must uniquely identify the mesh in terms of how it would be rendered to
    // the screen (not counting it's position)
    return [
      this.geometry.name,
      this.stylesId,
      this.scale.x,
      this.scale.y,
      this.scale.z,
      this.rotation.x,
      this.rotation.y,
      this.rotation.z
    ].join('~');
  }

  getProjectedPosition(camera) {
    // add one to the position to get the point at the bottom center of the tile
    const position = this.getPosition().clone().translate(new Vector3(1, 1, 0));
    camera.project(position);
    return position;
  }

  async generateImage(offscreen) {
    // safari workaround
    return new Promise((resolve) => {
      const image = new Image();
      image.addEventListener(
        'load',
        () => {
          resolve(image);
        },
        false
      );
      const dataURL = offscreen.toDataURL();
      image.src = dataURL;
    });
  }

  async cache(camera = G.CAMERA) {
    if (!this.cacheEnabled) return;
    const key = this.getKey();

    // get the projection, and update the bounding box
    const facesAndNormals = camera.project(this);

    // draw the object offscreen (booo firefox not supporting OffscreenCanvas)
    let offscreen = document.createElement('canvas');
    let offscreenCtx = offscreen.getContext('2d', {
      alpha: true
      // imageSmoothingEnabled: true,
      // antialias: true
    });
    offscreen.width = this.box[2] - this.box[0];
    offscreen.height = this.box[3] - this.box[1];

    // apply all styles
    this.applyAllStyles(offscreenCtx);

    // draw the projection to the canvas
    camera.drawFaces(facesAndNormals, offscreenCtx, this.box);

    let image;
    // render the bitmap
    if (G.SUPPORTS_BITMAP) {
      image = await createImageBitmap(
        offscreen,
        0,
        0,
        offscreen.width,
        offscreen.height
      );
    } else {
      image = await this.generateImage(offscreen);
    }

    camera.setCache(key, image);
    offscreen = null;
    offscreenCtx = null;

    return key;
  }

  render(camera, ctx) {
    ctx.save();
    // check if cache is supported
    if (G.CACHE && this.cacheEnabled) {
      // check if the image is in the cache
      const cache = camera.getCache(this.getKey());
      if (cache) {
        // write from cache
        const position = this.getProjectedPosition(camera);
        // draw from cache
        ctx.drawImage(
          cache,
          position.x - cache.width / 2,
          position.y - cache.height
        );
      }
    } else {
      // cpu render
      this.applyAllStyles(ctx);
      const faces = camera.project(this);
      camera.drawFaces(faces, ctx, false);
    }
    ctx.restore();
  }
}
