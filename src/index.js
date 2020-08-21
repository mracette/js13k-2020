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
  initPathToHover,
  initTree001
} from './setup/world';
import { initDom } from './setup/dom';
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

G.SCENE = new Group();
G.CAMERA = new Camera({
  magnification: 12
});
G.VISIBLE_MAP_WIDTH = G.CAMERA.getVisibleMapWidth();
G.VISIBLE_MAP_HEIGHT = G.CAMERA.getVisibleMapHeight();

Promise.all([
  initTiles(),
  initTestCubes(),
  initPlayer(),
  initHoverTile(),
  initPathToHover(),
  initTree001()
]).then((result) => {
  // initialization
  const [tiles, testCubes, player, hoverTile, pathToHover, trees001] = result;
  G.CAMERA.position.set(player.position);
  tiles.position.set(player.position);
  G.MAP = new Map({ diagonal: false, position: player.position });
  G.SCENE.add([testCubes, trees001, player]);
  console.log(G.SCENE);

  /* 
  Draw once upon initialization
  */
  const drawOnce = () => {
    tiles.render(G.CAMERA, G.TILE_CTX, true);
  };

  /* 
  Main draw loop
  */
  const draw = (time, clear = false) => {
    clear && G.CTX.clearRect(0, 0, G.DOM.CANVAS.width, G.DOM.CANVAS.height);
    G.SCENE.render(G.CAMERA, G.CTX, G.ISO);
    //renderTileCoords(tiles);
  };

  /* Drawn for the tile layer */
  const drawTiles = (time, clear = false) => {
    // clear if called
    clear &&
      G.TILE_CTX.clearRect(
        0,
        0,
        G.DOM.TILE_CANVAS.width,
        G.DOM.TILE_CANVAS.height
      );

    // updates the pathToHover with the AStar path
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

    // draw hover tile
    hoverTile.position.x = G.MOUSE_HOVER.x;
    hoverTile.position.y = G.MOUSE_HOVER.y;
    tiles.render(G.CAMERA, G.TILE_CTX);
    hoverTile.render(G.CAMERA, G.TILE_CTX);
    pathToHover.render(G.CAMERA, G.TILE_CTX);
  };

  drawOnce();

  G.DOM.CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());

  window.addEventListener('mousemove', (e) => {
    const needsUpdate = updateMouseHoverTile(e);
    if (needsUpdate) {
      updatePathToHoverTile(player.position);
      drawTiles();
    }
  });

  window.addEventListener('mousedown', (e) => {
    player.position.set(G.MOUSE_HOVER);
    G.CAMERA.position.set(player.position);
    draw(null, true);
    updatePathToHoverTile(player.position);
    drawTiles(null, true);
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
  //     draw(null, true);
  //   },
  //   false
  // );

  window.addEventListener('resize', () => {
    G.COORDS.SCREEN._baseHeight = G.DOM.CANVAS.height;
    G.COORDS.SCREEN._baseWidth = G.DOM.CANVAS.width;
    addScreenDependentGlobals(G);
    drawTiles(null);
    draw(null, true);
  });

  window.requestAnimationFrame(draw);
});
