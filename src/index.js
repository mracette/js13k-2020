import { SquareGeometry, BoxGeometry } from './geometries/shapes';
import { Vector3 } from './core/Vector3';
import { Mesh } from './core/Mesh';
import { Style } from './core/Style';
import { Map } from './state/map';
import { Group } from './core/Group';
import { Camera } from './core/Camera';
import {
  initTiles,
  initTestCubes,
  initPlayer,
  initHoverTile,
  initPathToHover
} from './setup/world';
import { initDom } from './setup/dom';
import { drawLines } from './drawing/shapes';
import { renderTileCoords } from './utils/screen';
import { updateMouseHoverTile } from './state/screen';
import { updatePathToHoverTile } from './state/player';
import {
  G,
  addScreenDependentGlobals,
  addScreenIndependentGlobals
} from './globals';

addScreenIndependentGlobals(G);
initDom();
addScreenDependentGlobals(G);

G.SCENE = new Group({ updatesOn: ['perspective', 'resize', 'mouse'] });
G.CAMERA = new Camera({
  magnification: 12,
  position: new Vector3(0, 0, 0)
});
G.VISIBLE_MAP_WIDTH = G.CAMERA.getVisibleMapWidth();
G.VISIBLE_MAP_HEIGHT = G.CAMERA.getVisibleMapHeight();
G.CAMERA.position = new Vector3(
  G.VISIBLE_MAP_WIDTH / 2,
  G.VISIBLE_MAP_HEIGHT / 2,
  0
);

Promise.all([
  initTiles(),
  initTestCubes(),
  initPlayer(),
  initHoverTile(),
  initPathToHover()
]).then((result) => {
  const [tiles, testCubes, player, hoverTile, pathToHover] = result;
  G.MAP = new Map({ diagonal: false, position: player.position });
  G.SCENE.add([player, testCubes]);
  console.log(G.SCENE);
  const drawOnce = () => {
    tiles.render(G.CAMERA, G.TILE_CTX, true);
  };
  const draw = (time, clear = false) => {
    G.SCENE.render(G.CAMERA, G.CTX, G.ISO);
    renderTileCoords(tiles);
  };

  drawOnce();

  G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('mousemove', (e) => {
    const needsUpdate = updateMouseHoverTile(e);
    if (needsUpdate) {
      // G.TILE_CTX.clearRect(
      //   0,
      //   0,
      //   G.DOM.TILE_CANVAS.width,
      //   G.DOM.TILE_CANVAS.height
      // );

      // draw path to hover
      updatePathToHoverTile(
        player.position.clone().translate(G.CAMERA.position).round()
      );
      G.PATHS.PLAYER_TO_HOVER.forEach((tile, i) => {
        const child = pathToHover.children[i];
        if (child) {
          child.position.x = tile.x;
          child.position.y = tile.y;
          child.enabled = true;
        } else {
          pathToHover.add(
            new Mesh(new SquareGeometry(), {
              autoCache: true
            })
          );
        }
      });
      const pathLength = G.PATHS.PLAYER_TO_HOVER.length;
      if (pathLength < pathToHover.children.length) {
        pathToHover.children
          .slice(pathLength)
          .forEach((child) => (child.enabled = false));
      }
      // console.log(...G.PATHS.PLAYER_TO_HOVER);

      // draw hover tile
      hoverTile.position.x = G.MOUSE_HOVER.x;
      hoverTile.position.y = G.MOUSE_HOVER.y;
      tiles.render(G.CAMERA, G.TILE_CTX);
      hoverTile.render(G.CAMERA, G.TILE_CTX);
      pathToHover.render(G.CAMERA, G.TILE_CTX);
    }
    // player.position.clone().translate(G.CAMERA.position)
    // console.log(G.CAMERA.position);
    // const pathLength = G.PATHS.PLAYER_TO_HOVER.length;
    // for (let i = 0; i < pathToHover.length; i++) {
    //   const child = pathToHover.children[i];
    //   if (i < pathLength) {
    //     child.visible = false;
    //   } else {
    //     child.visible = true;
    //     child.position.x = pathToHover[i].x;
    //     child.position.y = pathToHover[i].y;
    //   }
    // }
    // console.log(G.PATHS.PLAYER_TO_HOVER);
  });
  window.requestAnimationFrame(draw);
});

// document.addEventListener(
//   'keydown',
//   (e) => {
//     if (e.keyCode === 38) {
//       // up
//       G.CAMERA.position.y -= 1;
//     } else if (e.keyCode === 40) {
//       // down
//       G.CAMERA.position.y += 1;
//     } else if (e.keyCode === 37) {
//       // left
//       G.CAMERA.position.x -= 1;
//     } else if (e.keyCode === 39) {
//       // right
//       G.CAMERA.position.x += 1;
//     }
//     draw('key');
//   },
//   false
// );

// TODO: add refresh method to coords
// window.addEventListener('resize', () => {
//   G.COORDS.SCREEN._baseHeight = G.DOM.CANVAS.height;
//   G.COORDS.SCREEN._baseWidth = G.DOM.CANVAS.width;
//   addScreenDependentGlobals(G);
//   draw('resize');
// });

// G.CTX.strokeStyle = 'white';
// G.CTX.lineWidth = 10;

// drawLines([
//   new Vector3(0, 0),
//   new Vector3(500, 0),
//   new Vector3(500, 500),
//   new Vector3(0, 500),
//   new Vector3(0, 0)
// ]);

// drawLines([
//   new Vector3(0, 250),
//   new Vector3(500, 0),
//   new Vector3(1000, 250),
//   new Vector3(500, 500),
//   new Vector3(0, 250)
// ]);
