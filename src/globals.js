import { CanvasCoordinates } from 'crco-utils';
import { AStar } from './algos/movement';
import { Vector3 } from './core/Vector3';
import { Logger } from './core/Logger';

/**
 * @type {object} a single global object which other global values attach to
 */

export const G = {};

/**
 * SCREEN INDEPENENT
 * This means that the following are constants which will not change
 * with screen size or DOM state. This function only needs to be called once
 */

export const addScreenIndependentGlobals = (G) => {
  G.ISO = true;
  G.RATIO = { x: 2, y: 1 };
  G.CACHE = true;
  G.COLORS = {
    RAISIN_BLACK: '#272838',
    LIGHT_GRAY: '#CCCCCC',
    LILAC: '#7C77B9',
    EMERALD_GREEN: '#5BBA6F',
    WHITE_OVERLAY_02: 'rgba(255, 255, 255, .2)'
  };
  G.SUPPORTS_OFFSCREEN =
    typeof OffscreenCanvasRenderingContext2D === 'function';
  G.DOM = {
    CANVAS: document.getElementById('viz'),
    TILE_CANVAS: document.getElementById('tile-viz'),
    ROOT: document.getElementById('root'),
    BODY: document.body,
    HTML: document.documentElement
  };
  G.CTX = G.DOM.CANVAS.getContext('2d', { alpha: true });
  G.BORDER_WIDTH = 1;
  G.TILE_CTX = G.DOM.TILE_CANVAS.getContext('2d', { alpha: false });
  G.MAP_SIZE = {
    x: 21,
    y: 21
  };
  G.ASTAR = new AStar();
  G.PATHS = {
    PLAYER_TO_HOVER: []
  };
  G.MOUSE_HOVER = new Vector3(5, 5, 0);
  G.UID = 0;
  G.IMAGE_CACHE = {};
  G.LOGGER = new Logger('info');
};

/**
 * SCREEN DEPENDENT
 * This means that the following rely on the current screen / canvas size.
 * This function needs to be called every time the window / canvas resizes.
 */

export const addScreenDependentGlobals = (G) => {
  G.DPR = window.devicePixelRatio || 1;
  G.COORDS = {
    SCREEN: new CanvasCoordinates({ canvas: G.DOM.CANVAS })
  };
};
