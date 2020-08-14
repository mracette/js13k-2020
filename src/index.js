import { initDom } from './setup/dom';
import { updateMouseHoverTile } from './state/screen';
import { updatePlayerPosition } from './state/player';
import { drawTiles, setStyles } from './drawing/tiles';
import { drawPlayer } from './drawing/player';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

addScreenIndependentGlobals(G);
initDom();
addScreenDependentGlobals(G);

const draw = () => {
  G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
  setStyles();
  drawTiles();
  drawPlayer();
};

// TODO: add refresh method to coords
window.addEventListener('resize', () => {
  setStyles();
  G.COORDS.SCREEN._baseHeight = G.DOM.CANVAS.height;
  G.COORDS.SCREEN._baseWidth = G.DOM.CANVAS.width;
  addScreenDependentGlobals(G);
  draw();
});

G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('mousedown', updatePlayerPosition);
window.addEventListener('mousemove', updateMouseHoverTile);
window.addEventListener('mousemove', draw);

draw();
