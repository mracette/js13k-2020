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
      box: [] // minx, miny, maxx, maxy
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
    camera.project(position, true, G.CTX);
    return position;
  }

  async cache(
    camera = G.CAMERA,
    iso = G.ISO,
    w = G.DOM.CANVAS.width,
    h = G.DOM.CANVAS.height
  ) {
    const key = this.getKey();
    let offscreenCtx, offscreen;
    // TODO: implement power of two here?
    if (G.SUPPORTS_OFFSCREEN) {
      offscreen = new OffscreenCanvas(w, h);
      offscreenCtx = offscreen.getContext('2d', { alpha: true });
    } else {
      offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      offscreenCtx = offscreen.getContext('2d', { alpha: true });
    }
    this.applyAllStyles(offscreenCtx);
    // projects with boxToOrigin = true, meaning that the projection starts from the origin
    camera.project(this, iso, offscreenCtx, this.box, true, true);
    const image = await createImageBitmap(
      offscreen,
      0,
      0,
      this.box[2] - this.box[0],
      this.box[3] - this.box[1]
    );
    const texture = G.WEBGL.createTexture(image);
    camera.setCache(key, texture);
    offscreen = null;
    offscreenCtx = null;
    return key;
  }

  render(camera, ctx, iso = G.ISO, position = null) {
    if (this.enabled || this.needsUpdate) {
      // check if cache is supported
      if (G.CACHE && this.cacheEnabled) {
        // check if the image is in the cache
        const cache = camera.getCache(this.getKey());
        if (cache) {
          // write from cache
          const position = this.getProjectedPosition(camera);
          // store these for use elsewhere without recalculating
          this.screenX = position.x;
          this.screenY = position.y;
          // draw from cache
          G.WEBGL.drawTexture(
            cache,
            position.x - cache.width / 2,
            position.y - cache.height
          );
        } else if (this.isAutoCached()) {
          this.cache(camera, iso).then(() => this.render(camera, ctx, iso));
        } else {
          this.applyAllStyles();
          camera.project(this, iso, ctx, false, true);
        }
      } else {
        // cpu render
        this.applyAllStyles(ctx);
        camera.project(this, iso, ctx, false, true);
      }
    }
  }
}
