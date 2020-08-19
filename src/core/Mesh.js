import { G } from '../globals';
import { Vector3 } from './Vector3';
import { Entity } from './Entity';

export class Mesh extends Entity {
  constructor(geometry, opts = {}) {
    super(opts);
    const defaults = {
      type: 'mesh',
      style: null,
      autoCache: false,
      enabled: true,
      needsUpdate: null,
      box: [] // x, y, x, y
    };
    Object.assign(this, { geometry, ...defaults, ...opts });
  }

  getStyleList() {
    const list = [];
    let obj = this;
    while (obj) {
      obj.style && list.push(obj.style);
      obj = obj.parent || null;
    }
    return list;
  }

  applyAllStyles(ctx = G.CTX) {
    this.getStyleList().forEach((s) => s.apply(ctx));
  }

  getKey() {
    // must uniquely identify the mesh in terms of how it would be rendered to
    // the screen (not counting it's position)
    return [
      this.geometry.name,
      this.getStyleList()
        .map((s) => s.uid)
        .join('-'),
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
    const offscreen = new OffscreenCanvas(w, h);
    const offscreenCtx = offscreen.getContext('2d', { alpha: true });
    this.applyAllStyles(offscreenCtx);
    camera.project(this, iso, offscreenCtx, this.box, true);
    G.LOGGER.debug('writing to cache: ' + key);
    const image = await createImageBitmap(
      offscreen,
      0,
      0,
      this.box[2] - this.box[0],
      this.box[3] - this.box[1]
    );
    camera.setCache(key, image);
    return key;
  }

  render(camera, ctx, iso = G.ISO) {
    if (this.enabled || this.needsUpdate) {
      // check if cache is supported
      if (G.SUPPORTS_OFFSCREEN && G.CACHE) {
        // check if the image is in the cache
        const key = this.getKey();
        const cache = camera.getCache(this.getKey());
        if (cache) {
          if (this.parent && this.parent.uid === 'path-to-hover') {
            console.log(this);
          }
          // write from cache
          G.LOGGER.debug('writing from cache: ' + key);
          const position = this.getProjectedPosition(camera);
          ctx.drawImage(
            cache,
            position.x - cache.width / 2,
            position.y - cache.height
          );
        } else if (this.autoCache) {
          this.cache(camera, iso).then(() => this.render(camera, ctx, iso));
        } else {
          this.style && this.style.apply(ctx);
          camera.project(this, iso, ctx, false, true);
        }
      } else {
        // cpu render
        !G.SUPPORTS_OFFSCREEN && G.LOGGER.debug('cache not supported');
        !G.CACHE && G.LOGGER.debug('cache disabled');
        this.style && this.style.apply(ctx);
        camera.project(this, iso, ctx, false, true);
      }
    }
  }
}
