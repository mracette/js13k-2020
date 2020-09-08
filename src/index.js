import { Map } from './state/world';
import { Player } from './state/player';
import { Camera } from './core/Camera';
import { initDom } from './setup/dom';
// import { baseLine } from './entities/styles';
// import { renderTileCoords } from './utils/screen';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

window.addEventListener('mousedown', () => G.AUDIO.start());

// TODO: remove
// import Stats from 'stats.js/src/Stats';
// var stats = new Stats();
// stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild(stats.dom);

addScreenIndependentGlobals(G);
initDom();
addScreenDependentGlobals(G);

// init player
G.PLAYER = new Player();

// init camera
G.CAMERA = new Camera();
G.CAMERA.position.set(G.PLAYER.position);

// init map
G.MAP = new Map();

const postProcess = () => {
  const args = [0, 0, G.COORDS.width(), G.COORDS.height()];
  G.POST_CTX.clearRect(...args);
  G.POST_CTX.setTransform(2, 0, 0, 1, -G.DOM.POST_CANVAS.width / 2, 0);
  G.POST_CTX.fillStyle = G.GRADIENT;
  G.POST_CTX.fillRect(...args);
};

const drawWorld = (time) => {
  G.WEBGL.clear();
  G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
  G.PLAYER.updateActions(time);
  // identify the players position on the map to only render a certain area around them
  let px = Math.floor(G.PLAYER.mesh.position.x);
  let py = Math.floor(G.PLAYER.mesh.position.y);
  const [gpr, gpc] = G.MAP.getGridFromTile(px, py);
  const [vgr, vgc] = G.MAP.visibleGridSizeHalf;
  // render back to front; G.BOTTOM_SCREEN_BUFFER renders rows offscreen to prevent
  // a jarring entry/exit for tall objects
  for (
    let i = gpr + vgr + 1, n = gpr - vgr - G.BOTTOM_SCREEN_BUFFER;
    i > n;
    i--
  ) {
    for (let j = gpc - vgc, n = gpc + vgc; j < n; j++) {
      const entity = G.MAP.getEntityOnGrid(i, j);
      // entity && entity.entity.render(G.CAMERA, G.CTX);
      if (entity) {
        entity.entity.render(G.CAMERA, G.CTX);
      }
      // render the player in between other objects in the grid for proper overlap
      if (i === gpr && j === gpc) {
        G.PLAYER.face.render(G.CAMERA, G.CTX);
        G.PLAYER.mesh.render(G.CAMERA, G.CTX);
      }
    }
  }
};

const animate = (time) => {
  G.AUDIO.update(time);
  // stats.begin();
  G.CURRENT_TIME = time;
  G.TIME_DELTA = time - G.PREVIOUS_TIME;
  // updates player actions;
  const actionsAreOngoing = G.PLAYER.checkForActions(time);
  // updates position and rotation
  const playerPositionUpdated = G.PLAYER.updatePosition(time);
  // if player updated, so must the world; ongoing actions also cause a re-render
  if (playerPositionUpdated || actionsAreOngoing) {
    playerPositionUpdated && G.CAMERA.position.set(G.PLAYER.position);
    drawWorld(time);
  }
  G.PREVIOUS_TIME = time;
  // stats.end();
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
  drawWorld(0, true);
  postProcess();
  G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
});
