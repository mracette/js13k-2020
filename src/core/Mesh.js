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
      autoCache: true,
      cacheEnabled: true,
      enabled: true,
      needsUpdate: null,
      box: [] // x0, y0, x1, y1
    };
    this.screenX = null;
    this.screenY = null;
    Object.assign(this, { geometry, ...defaults, ...opts });
  }

  getKey() {
    // must uniquely identify the mesh in terms of how it would be rendered to
    // the screen (not counting it's position)
    return [
      this.geometry.name,
      this.style ? this.style.uid : '-',
      's' + this.scale.x,
      's' + this.scale.y,
      's' + this.scale.z,
      'r' + this.rotation.x,
      'r' + this.rotation.y,
      'r' + this.rotation.z
    ].join('~');
  }

  getProjectedPosition(camera) {
    // add one to the position to get the point at the bottom center of the tile
    const position = this.getPosition().clone().translate(new Vector3(1, 1, 0));
    camera.project(position);
    return position;
  }

  async cache(camera = G.CAMERA) {
    const key = this.getKey();

    // get the projection, and update the bounding box
    const facesAndNormals = camera.project(this, true);

    // let lw = null;
    // this.getStyleList().forEach((s) => {
    //   const lineWidth = s.styles['lineWidth'];
    //   console.log(lineWidth);
    //   if (typeof lineWidth === 'function') {
    //     lw = parseFloat(lineWidth());
    //   } else if (typeof lineWidth !== 'undefined') {
    //     lw = parseFloat(lineWidth);
    //   }
    // });

    // console.log(lw);

    // update the bounding box to account for stroke width
    // if (lw !== null) {
    //   this.box[0] -= lw / 2;
    //   this.box[1] -= lw / 2;
    //   this.box[2] += lw / 2;
    //   this.box[3] += lw / 2;
    // }
    const w = this.box[2] - this.box[0];
    const h = this.box[3] - this.box[1];

    let offscreenCtx, offscreen;
    //TODO: implement power of two here?
    if (G.SUPPORTS_OFFSCREEN) {
      offscreen = new OffscreenCanvas(w, h);
      offscreenCtx = offscreen.getContext('2d', {
        alpha: true,
        antialias: true
      });
    } else {
      offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      offscreenCtx = offscreen.getContext('2d', {
        alpha: true,
        antialias: true
      });
    }

    // apply all styles
    this.applyAllStyles(offscreenCtx);

    // draw the projection to the canvas, with boxToOrigin = true
    camera.drawFaces(facesAndNormals, offscreenCtx, this.box);

    // render the bitmap
    const image = await createImageBitmap(offscreen, 0, 0, w, h);
    const texture = G.WEBGL.createTexture(image);
    if (G.USE_WEBGL) {
      camera.setCache(key, texture);
    } else {
      camera.setCache(key, image);
    }
    offscreen = null;
    offscreenCtx = null;
    return key;
  }

  render(camera, ctx) {
    if (this.enabled || this.needsUpdate) {
      ctx.save();
      // check if cache is supported
      if (G.CACHE && this.cacheEnabled) {
        // check if the image is in the cache
        const cache = camera.getCache(this.getKey());
        if (cache) {
          // write from cache
          const position = this.getProjectedPosition(camera);
          // store these for external use
          this.screenX = position.x;
          this.screenY = position.y;
          // draw from cache
          if (G.USE_WEBGL) {
            G.WEBGL.drawImage(
              cache,
              position.x - cache.width / 2,
              position.y - cache.height
            );
          } else {
            ctx.drawImage(
              cache,
              position.x - cache.width / 2,
              position.y - cache.height
            );
          }
        } else if (this.isAutoCached()) {
          this.cache().then(() => this.render(camera, ctx));
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
}
