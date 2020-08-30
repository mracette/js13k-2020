import { Group } from './core/Group';
import { Map } from './state/world';
import { Player } from './state/player';
import { Camera } from './core/Camera';
import { WebGL2 } from './core/WebGL2';
import { initDom } from './setup/dom';
import { baseLine } from './entities/styles';
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

// const promises = [];

// let offscreen = document.createElement('canvas');
// let offscreenCtx = offscreen.getContext('2d');
// offscreenCtx.fillStyle = 'green';
// offscreenCtx.fillRect(0, 0, 100, 100);
// offscreenCtx.fillStyle = 'blue';
// offscreenCtx.fillRect(25, 25, 50, 50);
// promises.push(createImageBitmap(offscreen));

// offscreen = document.createElement('canvas');
// offscreenCtx = offscreen.getContext('2d');
// offscreenCtx.fillStyle = 'purple';
// offscreenCtx.fillRect(0, 0, 100, 100);
// offscreenCtx.fillStyle = 'cyan';
// offscreenCtx.fillRect(25, 25, 50, 50);
// promises.push(createImageBitmap(offscreen));

// Promise.all(promises).then((images) => {
//   const texture1 = G.WEBGL.createTexture(images[0]);
//   const texture2 = G.WEBGL.createTexture(images[1]);

//   const draw = (time) => {
//     const x = 50 + 50 * Math.sin(time / 1000);
//     const y = 50 + 50 * Math.sin(time / 1000);
//     G.WEBGL.drawImage(texture1, x, y);
//     G.WEBGL.drawImage(texture2, x + 100, y + 100);
//     window.requestAnimationFrame(draw);
//   };

//   window.requestAnimationFrame(draw);
// });

// init player
G.PLAYER = new Player();

// init camera
G.CAMERA = new Camera({
  magnification: 10
});
G.CAMERA.position.set(G.PLAYER.position);

// init map
G.VISIBLE_MAP_WIDTH = G.CAMERA.getVisibleMapWidth();
G.VISIBLE_MAP_HEIGHT = G.CAMERA.getVisibleMapHeight();
G.MAP = new Map();

// init scene
G.SCENE = new Group(null, { style: baseLine });

const postProcess = () => {
  const args = [0, 0, G.COORDS.getWidth(), G.COORDS.getHeight()];
  G.POST_CTX.clearRect(...args);
  G.POST_CTX.setTransform(2, 0, 0, 1, -G.DOM.POST_CANVAS.width / 2, 0);
  G.POST_CTX.fillStyle = G.GRADIENT;
  G.POST_CTX.fillRect(...args);
};

let prevTileX = null;
let prevTileY = null;

const drawTileGroup = (time, clear = false) => {
  clear && G.TILE_CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
  // centers the tiles around the player
  const newTileX = Math.floor(G.PLAYER.position.x);
  const newTileY = Math.ceil(G.PLAYER.position.y);
  if (newTileX !== prevTileX || newTileY !== prevTileY) {
    G.MAP.getEntity('tileGroup').position.x = newTileX;
    G.MAP.getEntity('tileGroup').position.y = newTileY;
    G.MAP.getEntity('tileGroup').render(G.CAMERA, G.TILE_CTX);
  }
};

const drawWorld = (time, clear = true) => {
  clear && G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
  drawTileGroup();
  G.PLAYER.updateActions(time);
  let px = Math.floor(G.PLAYER.mesh.position.x);
  let py = Math.floor(G.PLAYER.mesh.position.y);
  const [gpr, gpc] = G.MAP.getGridFromTile(px, py);
  const [vgr, vgc] = G.MAP.visibleGridSizeHalf;
  // render back to front
  // G.BOTTOM_SCREEN_BUFFER renders rows offscreen to prevent jarring entry/exit for tall objects
  for (
    let i = gpr + vgr + 1, n = gpr - vgr - G.BOTTOM_SCREEN_BUFFER;
    i > n;
    i--
  ) {
    for (let j = gpc - vgc, n = gpc + vgc; j < n; j++) {
      // do nothing if out of map bounds
      if (i >= 0 && i < G.MAP.height && j >= 0 && j < G.MAP.width) {
        if (G.MAP.grid[i][j]) {
          G.MAP.grid[i][j].entity.render(G.CAMERA, G.CTX);
        }
        // render the player in between other objects in the grid for proper overlap
        if (i === gpr && j === gpc) {
          G.PLAYER.mesh.render(G.CAMERA, G.CTX);
        }
      }
    }
  }
};

// let renderNextFrame = false;

const animate = (time, clear = true) => {
  stats.begin();
  G.CURRENT_TIME = time;
  // updates player actions;
  const actionsAreOngoing = G.PLAYER.checkForActions(time);
  // updates position and rotation
  const playerPositionUpdated = G.PLAYER.updatePosition(time);
  // if player updated, so must the world; ongoing actions also cause a re-render
  if (playerPositionUpdated || actionsAreOngoing) {
    playerPositionUpdated && G.CAMERA.position.set(G.PLAYER.position);
    drawWorld(time);
  }
  stats.end();
  G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
};

G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('keydown', (e) => {
  G.PLAYER.onKeyDown(e);
});

window.addEventListener('keyup', (e) => {
  G.PLAYER.onKeyUp(e);
});

G.MAP.cacheEntities().then(() => {
  drawWorld();
  postProcess();
  G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
});
