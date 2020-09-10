import { Map } from './state/world';
import { Player } from './state/player';
import { Camera } from './core/Camera';
import { initDom } from './setup/dom';
import { Action } from './core/Action';
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

const cacheGradient = async (ctx) => {
  return true;
  // drawGradient(ctx);
  // const image = await G.CAMERA.canvasToImage(ctx.canvas);
  // return image;
};

let prevTileX = null;
let prevTileY = null;
const drawTileGroup = () => {
  // centers the tiles around the player
  const newTileX = Math.floor(G.PLAYER.position.x);
  const newTileY = Math.ceil(G.PLAYER.position.y);
  if (newTileX !== prevTileX || newTileY !== prevTileY) {
    G.MAP.getEntity('tileGroup').position.x = newTileX;
    G.MAP.getEntity('tileGroup').position.y = newTileY;
    G.MAP.getEntity('tileGroup').render(G.CAMERA, G.CTX);
  }
};

const showShop = () => {
  G.DOM.SHOP.style.height = G.DOM.CANVAS.style.height;
  G.DOM.SHOP.style.visibility = 'visible';
};

const drawWorld = (time) => {
  G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
  drawTileGroup();
  G.PLAYER.updateActions(time);
  // identify the players position on the map to only render a certain area around them
  let px = Math.ceil(G.PLAYER.mesh.position.x);
  let py = Math.ceil(G.PLAYER.mesh.position.y);
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
        // the tile object is either a entity or an action
        const e = entity.entity;
        const a = entity.action;
        e && e.render(G.CAMERA, G.CTX);
        if (a) {
          a.render(G.CURRENT_TIME, i, j);
        }
      }
      // render the player in between other objects in the grid for proper overlap
      if (i === gpr && j === gpc) {
        let order = [0, 1];
        G.PLAYER.orientation === 'up' && (order = [1, 0]);
        G.PLAYER.mesh.children[order[0]].render(G.CAMERA, G.CTX);
        G.PLAYER.mesh.children[order[1]].render(G.CAMERA, G.CTX);
      }
    }
  }
  // drawBlur();
};

const animate = (time) => {
  // G.AUDIO.update(time);
  // stats.begin();
  G.CURRENT_TIME = time;
  G.TIME_DELTA = time - G.PREVIOUS_TIME;
  // updates map actions
  const mapActions = G.MAP.actions.length > 0;
  // updates player actions
  const playerActions = G.PLAYER.checkForActions(time);
  // updates position and rotation
  const playerPositionUpdated = G.PLAYER.updatePosition(time);
  // if player updated, so must the world; ongoing actions also cause a re-render
  if (playerPositionUpdated || playerActions || mapActions) {
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

window.addEventListener('wheel', (e) => {
  G.CAMERA.magnification += e.deltaY / 100;
  drawWorld(G.CURRENT_TIME);
});

G.MAP.cacheEntities().then(() => {
  cacheGradient(G.BLUR_CTX).then((image) => {
    G.GRADIENT_CACHE = image;
    G.BLUR_CTX.filter = 'blur(.2vw) brightness(150%)';
    G.ANIMATION_FRAME = window.requestAnimationFrame(animate);
    drawWorld(0);
    showShop();
  });
});
