import { CanvasCoordinates } from 'crco-utils';

/**
 * @type {object} a single global object which other global values attach to
 */

export const G = {
  UID: 0
};

/**
 * SCREEN INDEPENENT
 * This means that the following are constants which will not change
 * with screen size or DOM state. This function only needs to be called once
 */

export const addScreenIndependentGlobals = (G) => {
  G.ISO = true;
  G.RATIO = { x: 2, y: 1 };
  G.CACHE = true;
  G.SUPPORTS_OFFSCREEN =
    typeof OffscreenCanvasRenderingContext2D === 'function';
  G.DOM = {
    CANVAS: document.getElementById('viz'),
    TILE_CANVAS: document.getElementById('tile'),
    POST_CANVAS: document.getElementById('post'),
    ROOT: document.getElementById('root'),
    BODY: document.body,
    HTML: document.documentElement
  };
  G.CTX = G.DOM.CANVAS.getContext('2d', { alpha: true });
  G.TILE_CTX = G.DOM.TILE_CANVAS.getContext('2d', { alpha: false });
  G.POST_CTX = G.DOM.POST_CANVAS.getContext('2d', { alpha: true });
  G.BORDER_WIDTH = 1;
  // G.MAP_SIZE = {
  //   x: 21,
  //   y: 21
  // };
  G.ANIMATION_FRAME;
  G.CURRENT_TIME;
};

/**
 * SCREEN DEPENDENT
 * This means that the following rely on the current screen / canvas size.
 * This function needs to be called every time the window / canvas resizes.
 */

export const addScreenDependentGlobals = (G) => {
  G.DPR = window.devicePixelRatio || 1;
  G.COORDS = new CanvasCoordinates({ canvas: G.DOM.CANVAS });
  G.GRADIENT = G.CTX.createRadialGradient(
    G.COORDS.nx(0),
    G.COORDS.ny(0),
    G.COORDS.getHeight() / 4,
    G.COORDS.nx(0),
    G.COORDS.ny(0),
    G.COORDS.getHeight()
  );
  G.GRADIENT.addColorStop(0, 'rgba(255, 255, 255, 0)');
  G.GRADIENT.addColorStop(0.5, 'rgba(255, 255, 255, .15)');
  G.GRADIENT.addColorStop(1, 'rgba(255, 255, 255, .35)');
};
