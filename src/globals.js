import { GameAudio } from './core/GameAudio';
import { CanvasCoordinates } from './core/Coords';
import { getElement } from './utils/functions';

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
  G.CACHE = true;
  G.SUPPORTS_OFFSCREEN =
    typeof OffscreenCanvasRenderingContext2D === 'function';
  G.SUPPORTS_BITMAP = typeof createImageBitmap === 'function';
  G.DOM = {
    CANVAS: getElement('viz'),
    POST_CANVAS: getElement('post'),
    ROOT: getElement('root'),
    BODY: document.body,
    HTML: document.documentElement
  };
  G.CTX = G.DOM.CANVAS.getContext('2d', {
    alpha: true,
    antialias: true
    // imageSmoothingEnabled: true
  });
  G.POST_CTX = G.DOM.POST_CANVAS.getContext('2d', { alpha: true });
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
