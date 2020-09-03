import { GameAudio } from './core/GameAudio';
import { CanvasCoordinates } from './core/Coords';
import { WebGL } from './core/WebGL';

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
  G.CACHE = true;
  G.USE_WEBGL = true;
  G.SUPPORTS_OFFSCREEN =
    typeof OffscreenCanvasRenderingContext2D === 'function';
  G.DOM = {
    CANVAS: document.getElementById('viz'),
    WEBGL_CANVAS: document.getElementById('webgl'),
    POST_CANVAS: document.getElementById('post'),
    ROOT: document.getElementById('root'),
    BODY: document.body,
    HTML: document.documentElement
  };
  G.DOM.WEBGL_CANVAS.style.background = 'rgba(255, 0, 0, 0)';
  G.DOM.WEBGL_CANVAS.style.backgroundColor = 'rgba(255,0,0,0)';
  G.CTX = G.DOM.CANVAS.getContext('2d', { alpha: true });
  G.POST_CTX = G.DOM.POST_CANVAS.getContext('2d', { alpha: true });
  G.WEBGL_CTX = G.DOM.WEBGL_CANVAS.getContext('webgl', {
    alpha: false,
    premultipliedAlpha: true,
    antialias: false
  });
  G.WEBGL = new WebGL(G.WEBGL_CTX);
  G.BORDER_WIDTH = 1;
  G.BOTTOM_SCREEN_BUFFER = 8;
  G.ANIMATION_FRAME;
  G.CURRENT_TIME;
  G.AUDIO = new GameAudio();
};

/**
 * SCREEN DEPENDENT
 * This means that the following rely on the current screen / canvas size.
 * This function needs to be called every time the window / canvas resizes.
 */

export const addScreenDependentGlobals = (G) => {
  G.DPR = window.devicePixelRatio || 1;
  G.COORDS = new CanvasCoordinates(G.DOM.CANVAS);
  G.GRADIENT = G.CTX.createRadialGradient(
    G.COORDS.nx(0),
    G.COORDS.ny(0),
    G.COORDS.height(0.25),
    G.COORDS.nx(0),
    G.COORDS.ny(0),
    G.COORDS.height()
  );
  G.GRADIENT.addColorStop(0, 'rgba(255, 255, 255, 0)');
  G.GRADIENT.addColorStop(0.5, 'rgba(255, 255, 255, .15)');
  G.GRADIENT.addColorStop(1, 'rgba(255, 255, 255, .35)');
};
