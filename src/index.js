import { Map } from './state/world';
import { Player } from './state/player';
import { Camera } from './core/Camera';
import { initDom } from './setup/dom';
import { hazyPurple } from './entities/styles';
import { boundedSin } from './utils/math';
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

const renderStats = () => {
  G.CTX.save();
  G.CTX.fillStyle = 'black';
  G.CTX.strokeStyle = 'green';
  G.CTX.lineWidth = G.COORDS.height(0.005);
  G.CTX.fillRect(
    G.COORDS.nx(-1),
    G.COORDS.ny(1) - G.BAR_HEIGHT,
    G.COORDS.width(),
    G.BAR_HEIGHT
  );
  // life bar
  G.CTX.strokeRect(
    G.COORDS.nx(-0.5) - G.CTX.lineWidth,
    G.COORDS.ny(1) - G.BAR_HEIGHT + G.CTX.lineWidth / 2,
    G.COORDS.width(0.25),
    G.BAR_HEIGHT - G.CTX.lineWidth
  );
  G.CTX.fillStyle = 'green';
  G.CTX.fillRect(
    G.COORDS.nx(-0.5) - G.CTX.lineWidth + (3 * G.CTX.lineWidth) / 2,
    G.COORDS.ny(1) - G.BAR_HEIGHT + G.CTX.lineWidth * 2,
    (G.COORDS.width(0.25) - (6 * G.CTX.lineWidth) / 2) *
      (G.PLAYER.currentLife / G.PLAYER.maxLife),
    G.BAR_HEIGHT - G.CTX.lineWidth * 4
  );
  G.CTX.fillStyle = 'white';
  G.CTX.fillText(
    Math.round(G.PLAYER.currentLife),
    G.COORDS.nx(-0.5) - G.CTX.lineWidth / 2 + G.CTX.lineWidth * 3,
    G.COORDS.ny(1) - G.BAR_HEIGHT / 2
  );
  // haze bar
  G.CTX.strokeStyle = hazyPurple.fillStyle;
  G.CTX.strokeRect(
    G.COORDS.nx(0) + G.CTX.lineWidth,
    G.COORDS.ny(1) - G.BAR_HEIGHT + G.CTX.lineWidth / 2,
    G.COORDS.width(0.25),
    G.BAR_HEIGHT - G.CTX.lineWidth
  );
  G.CTX.fillStyle = hazyPurple.fillStyle;
  G.CTX.fillRect(
    G.COORDS.nx(0) + G.CTX.lineWidth + (3 * G.CTX.lineWidth) / 2,
    G.COORDS.ny(1) - G.BAR_HEIGHT + G.CTX.lineWidth * 2,
    (G.COORDS.width(0.25) - (6 * G.CTX.lineWidth) / 2) * (G.PLAYER.haze / 10),
    G.BAR_HEIGHT - G.CTX.lineWidth * 4
  );
  G.CTX.fillStyle = 'white';
  G.CTX.fillText(
    `Haze: ${G.PLAYER.hazeAmount}`,
    G.COORDS.nx(0) + G.CTX.lineWidth + G.CTX.lineWidth * 3,
    G.COORDS.ny(1) - G.BAR_HEIGHT / 2
  );
  // money
  G.CTX.fillText(
    `${G.PLAYER.money}g`,
    G.COORDS.nx(-0.75),
    G.COORDS.ny(1) - G.BAR_HEIGHT / 2
  );
  // experience
  G.CTX.fillText(
    `${G.PLAYER.experience} exp`,
    G.COORDS.nx(0.75),
    G.COORDS.ny(1) - G.BAR_HEIGHT / 2
  );
  G.CTX.restore();
};

export const showShop = () => {
  G.DOM.SHOP.style.height = G.DOM.CANVAS.style.height;
  G.DOM.SHOP.style.display = 'flex';
};

export const closeShop = () => {
  G.DOM.SHOP.style.display = 'none';
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
        if (G.PLAYER.quad >= 0.2 && G.PLAYER.quad <= 0.7) {
          // render machete first
          G.PLAYER.machete.render(G.CAMERA, G.CTX);
        }
        if (G.PLAYER.quad > 0.3 && G.PLAYER.quad < 0.7) {
          G.PLAYER.face.render(G.CAMERA, G.CTX);
          G.PLAYER.mesh.children[0].render(G.CAMERA, G.CTX);
        } else {
          G.PLAYER.mesh.children[0].render(G.CAMERA, G.CTX);
          G.PLAYER.face.render(G.CAMERA, G.CTX);
        }
        if (G.PLAYER.quad < 0.2 || G.PLAYER.quad > 0.7) {
          // render machete last
          G.PLAYER.machete.render(G.CAMERA, G.CTX);
        }
      }
    }
  }
  // drawBlur();
};

const animate = (time, loop = false) => {
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
  if (playerPositionUpdated || playerActions || mapActions || time === 0) {
    playerPositionUpdated && G.CAMERA.position.set(G.PLAYER.position);
    drawWorld(time);
  }
  G.PLAYER.currentLife -= G.PLAYER.haze * 0.0001 * (G.TIME_DELTA || 0);
  // shows life, experience, etc
  renderStats();
  G.PREVIOUS_TIME = time;
  // stats.end();
  loop && (G.ANIMATION_FRAME = window.requestAnimationFrame(animate));
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

const landingSequence = () => {
  G.CTX.fillStyle = 'rgba(0,0,0,.5)';
  const p = 10000;
  const sine = boundedSin(p, 1, 8, (3 * p) / 2);
  const draw = (time) => {
    G.CTX.clearRect(0, 0, G.COORDS.width(), G.COORDS.height());
    G.CAMERA.magnification = sine(time);
    G.MAP.getEntity('tileGroup').rotation.z += 0.1;
    drawTileGroup();
    G.CTX.fillRect(0, 0, G.COORDS.width(), G.COORDS.height());
    G.ANIMATION_FRAME = window.requestAnimationFrame(draw);
  };
  G.ANIMATION_FRAME = window.requestAnimationFrame(draw);
};

const startSequence = async () => {
  G.CAMERA.magnification = 0.2;
  drawWorld();
  return true;
};

G.MAP.cacheEntities().then(() => {
  landingSequence();
  // startSequence().then(() => {
  // animate(0, true);
  // });
});
