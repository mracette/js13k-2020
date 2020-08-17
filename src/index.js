import { main } from './designer';
// import { Box } from './drawing/objects';
import { SquareGeometry } from './geometries/shapes';
import { Group } from './core/Group';
import { Point } from './core/Point';
import { Camera } from './core/Camera';
import { Mesh } from './core/Mesh';
import { Style } from './core/Style';
import { initTiles, initTestCubes } from './setup/world';

import { initDom } from './setup/dom';
import { updateMouseHoverTile } from './state/screen';
import { updatePlayerPosition, updatePathToHoverTile } from './state/player';
import { drawTileOutlines, drawPathToHover, setStyles } from './drawing/tiles';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

addScreenIndependentGlobals(G);
initDom();
addScreenDependentGlobals(G);

console.log(G.CAMERA.screenToMap(new Point(5, 5, 5)));
console.log(
  G.CAMERA.mapToScreen(new Point(-11.900621118012422, -5.875776397515528, 0))
);

const tiles = initTiles();
const hoverTile = new Mesh(SquareGeometry, {
  position: new Point(10, 10, 0),
  style: new Style([['fillStyle', G.COLORS.EMERALD_GREEN]]),
  updatesOn: ['perspective', 'resize', 'mouse']
});
const cubes = initTestCubes();

G.SCENE.add([tiles, hoverTile, cubes]);

const draw = (event, clear) => {
  clear && G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
  G.SCENE.render(event, G.CAMERA, true);
};

document.addEventListener(
  'keydown',
  (e) => {
    if (e.keyCode === 38) {
      // up
      G.CAMERA.position.y -= 1;
    } else if (e.keyCode === 40) {
      // down
      G.CAMERA.position.y += 1;
    } else if (e.keyCode === 37) {
      // left
      G.CAMERA.position.x -= 1;
    } else if (e.keyCode === 39) {
      // right
      G.CAMERA.position.x += 1;
    }
    draw('key');
  },
  false
);

// TODO: add refresh method to coords
window.addEventListener('resize', () => {
  setStyles();
  G.COORDS.SCREEN._baseHeight = G.DOM.CANVAS.height;
  G.COORDS.SCREEN._baseWidth = G.DOM.CANVAS.width;
  addScreenDependentGlobals(G);
  draw('resize');
});

// console.log(G.MAP.grid);
// console.log(G.ASTAR.search(G.MAP, G.MAP.grid[5][5], G.MAP.grid[6][6]));

G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());
// window.addEventListener('mousedown', updatePlayerPosition);
window.addEventListener('mousemove', (e) => {
  updateMouseHoverTile(e);
  console.log(G.MOUSE_HOVER);
  hoverTile.position.x = G.MOUSE_HOVER.x;
  hoverTile.position.y = G.MOUSE_HOVER.y;
  draw('mouse');
});
// window.addEventListener('mousemove', updatePathToHoverTile);
// window.addEventListener('mousemove', draw);

draw(null);
