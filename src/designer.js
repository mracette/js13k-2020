import { initDom } from './setup/dom';
import { updateMouseHoverTile } from './state/screen';
import { updatePlayerPosition, updatePathToHoverTile } from './state/player';
import { drawTileOutlines, drawPathToHover, setStyles } from './drawing/tiles';
import { drawPlayer } from './drawing/player';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

import { boxObject } from './drawing/objects';

export const main = () => {
  addScreenIndependentGlobals(G);
  initDom();
  addScreenDependentGlobals(G);

  const box1 = new boxObject();

  const draw = () => {
    G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
    setStyles();
    // drawTileOutlines(false);
    box1.render(false, true);
    box1.render(true, true);
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
  //   window.addEventListener('mousemove', updateMouseHoverTile);
  //   window.addEventListener('mousemove', draw);

  draw();
};
