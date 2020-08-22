import { SquareGeometry, BoxGeometry } from './geometries/shapes';
import { Vector3 } from './core/Vector3';
import { Mesh } from './core/Mesh';
import { Style } from './core/Style';
import { Map } from './algos/movement';
import { Group } from './core/Group';
import { Camera } from './core/Camera';
import * as initWorld from './setup/world';
import { initDom } from './setup/dom';
import { renderTileCoords } from './utils/screen';
import { updateMouseHoverTile } from './state/screen';
import { updatePathToHoverTile } from './state/player';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';
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
G.CAMERA.projectTransform(G.PROJECTED_ORIGIN);

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
  G.MAP = new Map({ diagonal: false, position: obj.player.position });
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

  const animate = (time, clear = true) => {
    stats.begin();
    G.CURRENT_TIME = time;
    const needsUpdate = obj.player.updatePosition(time);
    if (needsUpdate) {
      G.CAMERA.position.set(obj.player.position);
      drawWorld(time);
    }
    stats.end();
    G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
  };

  /* Drawn for the tile layer */
  const drawTiles = (time, clear = false) => {
    // clear if called
    clear &&
      G.TILE_CTX.clearRect(
        0,
        0,
        G.DOM.TILE_CANVAS.width,
        G.DOM.TILE_CANVAS.height
      );

    // // updates the pathToHover with the AStar path
    // G.PATHS.PLAYER_TO_HOVER.forEach((tile, i) => {
    //   const child = obj.pathToHover.children[i];
    //   if (child) {
    //     child.position.x = tile.x;
    //     child.position.y = tile.y;
    //     child.enabled = true;
    //   } else {
    //     obj.pathToHover.add(
    //       new Mesh(new SquareGeometry(), {
    //         autoCache: true
    //       })
    //     );
    //   }
    // });
    // const pathLength = G.PATHS.PLAYER_TO_HOVER.length;
    // if (pathLength < obj.pathToHover.children.length) {
    //   obj.pathToHover.children
    //     .slice(pathLength)
    //     .forEach((child) => (child.enabled = false));
    // }

    // draw hover tile
    // obj.hoverTile.position.x = G.MOUSE_HOVER.x;
    // obj.hoverTile.position.y = G.MOUSE_HOVER.y;
    obj.tiles.render(G.CAMERA, G.TILE_CTX);
    // obj.hoverTile.render(G.CAMERA, G.TILE_CTX);
    // obj.pathToHover.render(G.CAMERA, G.TILE_CTX);
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

  // window.addEventListener('mousemove', (e) => {
  //   const needsUpdate = updateMouseHoverTile(e);
  //   if (needsUpdate) {
  //     console.log(obj.player.position);
  //     updatePathToHoverTile(obj.player.position.clone().round());
  //     drawTiles();
  //   }
  // });

  // window.addEventListener('mousedown', (e) => {
  //   // obj.player.position.set(G.MOUSE_HOVER);
  //   // obj.player.mesh.position.set(G.MOUSE_HOVER);
  //   // G.CAMERA.position.set(obj.player.position);
  //   obj.player.move(G.PATHS.PLAYER_TO_HOVER, G.CURRENT_TIME);
  //   drawTiles(null, true);
  // });

  G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
});
