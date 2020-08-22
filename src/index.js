import { Style } from './core/Style';
import { Group } from './core/Group';
import { Camera } from './core/Camera';
import * as initWorld from './setup/world';
import { initDom } from './setup/dom';
import { renderTileCoords } from './utils/screen';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

// TODO: remove
import Stats from 'stats.js/src/Stats';
var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

addScreenIndependentGlobals(G);
initDom();
addScreenDependentGlobals(G);

G.SCENE = new Group();
G.CAMERA = new Camera({
  magnification: 12
});
G.VISIBLE_MAP_WIDTH = G.CAMERA.getVisibleMapWidth();
G.VISIBLE_MAP_HEIGHT = G.CAMERA.getVisibleMapHeight();

const styles = {
  baseLineStyle: new Style({
    strokeStyle: 'white',
    lineWidth: 2,
    lineJoin: 'round',
    lineCap: 'round'
  }),
  emeraldGreen: new Style({
    fillStyle: G.COLORS.EMERALD_GREEN
  }),
  lilac: new Style({
    fillStyle: G.COLORS.LILAC
  }),
  raisinBlack: new Style({
    fillStyle: G.COLORS.RAISIN_BLACK
  }),
  brown: new Style({
    fillStyle: 'brown'
  })
};

const initFunctions = Object.entries(initWorld);

Promise.all(initFunctions.map((kvs) => kvs[1](styles))).then((results) => {
  const obj = {};
  results.forEach((result, i) => {
    console.log(result);
    obj[initFunctions[i][0]] = result;
  });

  // initialization
  G.CAMERA.position.set(obj.player.position);
  obj.tiles.position.set(obj.player.position);
  G.SCENE.add([obj.testCubes, obj.allTrees, obj.player.mesh]);

  const postProcess = () => {
    const args = [0, 0, G.COORDS.getWidth(), G.COORDS.getHeight()];
    G.POST_CTX.clearRect(...args);
    G.POST_CTX.setTransform(2, 0, 0, 1, -G.DOM.POST_CANVAS.width / 2, 0);
    G.POST_CTX.fillStyle = G.GRADIENT;
    G.POST_CTX.fillRect(...args);
  };

  /* Objects that aren't the player */
  const drawWorld = (time, clear = true) => {
    clear && G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
    G.SCENE.render(G.CAMERA, G.CTX, G.ISO);
    //renderTileCoords(tiles);
  };

  /* Drawn for the tile layer */
  const drawTiles = (time, clear = true) => {
    // clear if called
    clear &&
      G.TILE_CTX.clearRect(
        0,
        0,
        G.DOM.TILE_CANVAS.width,
        G.DOM.TILE_CANVAS.height
      );
    obj.tiles.render(G.CAMERA, G.TILE_CTX);
  };

  const animate = (time, clear = true) => {
    stats.begin();
    G.CURRENT_TIME = time;
    const needsUpdate = obj.player.updatePosition(time);
    if (needsUpdate) {
      G.CAMERA.position.set(obj.player.position);
      drawWorld(time);
      drawTiles(time);
    }
    stats.end();
    G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
  };

  drawWorld();
  drawTiles();
  postProcess();

  G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('keydown', (e) => {
    obj.player.onKeyDown(e);
  });

  window.addEventListener('keyup', (e) => {
    obj.player.onKeyUp(e);
  });

  G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
});
