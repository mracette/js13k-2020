import { main } from './designer';

main();

// import { initDom } from './setup/dom';
// import { updateMouseHoverTile } from './state/screen';
// import { updatePlayerPosition, updatePathToHoverTile } from './state/player';
// import { drawTileOutlines, drawPathToHover, setStyles } from './drawing/tiles';
// import { drawPlayer } from './drawing/player';
// import {
//   G,
//   addScreenDependentGlobals,
//   addScreenIndependentGlobals
// } from './globals';

// addScreenIndependentGlobals(G);
// initDom();
// addScreenDependentGlobals(G);

// const draw = () => {
//   G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
//   setStyles();
//   drawTileOutlines();
//   drawPlayer();
//   drawPathToHover();
// };

// // TODO: add refresh method to coords
// window.addEventListener('resize', () => {
//   setStyles();
//   G.COORDS.SCREEN._baseHeight = G.DOM.CANVAS.height;
//   G.COORDS.SCREEN._baseWidth = G.DOM.CANVAS.width;
//   addScreenDependentGlobals(G);
//   draw();
// });

// console.log(G.MAP.grid);
// console.log(G.ASTAR.search(G.MAP, G.MAP.grid[5][5], G.MAP.grid[6][6]));

// G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());
// window.addEventListener('mousedown', updatePlayerPosition);
// window.addEventListener('mousemove', updateMouseHoverTile);
// window.addEventListener('mousemove', updatePathToHoverTile);
// window.addEventListener('mousemove', draw);

// draw();
