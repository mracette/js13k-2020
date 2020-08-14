import { initDom } from './setup/dom';
import { updateMouseHoverTile } from './utils/screen';
import { drawTiles, setStyles } from './drawing/tiles';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

addScreenIndependentGlobals(G);
initDom();
console.log(G.DOM.CANVAS.width);
addScreenDependentGlobals(G);

const draw = () => {
  setStyles();
  drawTiles();
};

// TODO: add refresh method to coords
window.addEventListener('resize', () => {
  setStyles();
  G.COORDS.SCREEN._baseHeight = G.DOM.CANVAS.height;
  G.COORDS.SCREEN._baseWidth = G.DOM.CANVAS.width;
  addScreenDependentGlobals(G);
  draw();
});

window.addEventListener('mousemove', updateMouseHoverTile);
// window.addEventListener('mousemove', draw);

draw();
