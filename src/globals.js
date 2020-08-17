import { CanvasCoordinates } from 'crco-utils';
import { AStar } from './algos/movement';
import { Map, MapNode } from './state/map';
import { Camera } from './core/Camera';
import { Point } from './core/Point';
import { Group } from './core/Group';

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
  G.DOM = {
    CANVAS: document.getElementById('viz'),
    ROOT: document.getElementById('root'),
    BODY: document.body,
    HTML: document.documentElement
  };
  G.BORDER_WIDTH = 1;
  G.CTX = G.DOM.CANVAS.getContext('2d');
  G.COLORS = {
    RAISIN_BLACK: '#272838',
    LIGHT_GRAY: '#CCCCCC',
    LILAC: '#7C77B9',
    EMERALD_GREEN: '#5BBA6F',
    WHITE_OVERLAY_02: 'rgba(255, 255, 255, .2)'
  };
  G.MAP_SIZE = {
    x: 21,
    y: 21
  };
  G.ASTAR = new AStar();
  G.MAP = new Map({
    mapWidth: G.MAP_SIZE.x,
    mapHeight: G.MAP_SIZE.y,
    diagonal: false
  });
  G.PATHS = {
    PLAYER_TO_HOVER: []
  };
  G.MOUSE_HOVER = new Point(5, 5, 0);
  G.UID = 0;
  G.CAMERA = new Camera({
    magnification: 12,
    position: new Point(10, 10, 0)
  });
  G.SCENE = new Group({ updatesOn: ['perspective', 'resize', 'mouse'] });
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
  G.ORTHO_TILE_WIDTH = G.COORDS.SCREEN.getHeight() / G.SCREEN_TILES;
  G.ORTHO_TILE_WIDTH_HALF = G.ORTHO_TILE_WIDTH / 2;
  G.ORTHO_TILE_HEIGHT = G.ORTHO_TILE_WIDTH;
  G.ORTHO_TILE_HEIGHT_HALF = G.ORTHO_TILE_HEIGHT / 2;
  G.ISO_TILE_WIDTH = G.ORTHO_TILE_WIDTH * G.RATIO.x;
  G.ISO_TILE_WIDTH_HALF = G.ISO_TILE_WIDTH / 2;
  G.ISO_TILE_HEIGHT = G.ORTHO_TILE_HEIGHT * G.RATIO.y;
  G.ISO_TILE_HEIGHT_HALF = G.ISO_TILE_HEIGHT / 2;
};
