import { G } from '../globals';
import { Group } from '../core/Group';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Style } from '../core/Style';
import { SquareGeometry, BoxGeometry } from '../geometries/shapes';

const squareGeo = new SquareGeometry();
const boxGeo = new BoxGeometry();

export const initPathToHover = () => {
  return new Promise((resolve) => {
    const pathToHoverGroup = new Group({
      uid: 'path-to-hover',
      style: new Style({
        strokeStyle: 'white',
        lineWidth: () => G.COORDS.SCREEN.getWidth() * 0.0005,
        fillStyle: G.COLORS.EMERALD_GREEN
      })
    });
    resolve(pathToHoverGroup);
  });
};

export const initHoverTile = () => {
  return new Mesh(squareGeo, {
    autoCache: true,
    style: new Style({
      strokeStyle: 'white',
      lineWidth: () => G.COORDS.SCREEN.getWidth() * 0.0005,
      fillStyle: G.COLORS.EMERALD_GREEN
    })
  });
};

export const initPlayer = () => {
  return new Promise((resolve) => {
    const playerGroup = new Group({ uid: 'player-group' });
    playerGroup.style = new Style({
      fillStyle: G.COLORS.EMERALD_GREEN,
      strokeStyle: 'white',
      lineWidth: 10,
      lineJoin: 'round',
      lineCap: 'round'
    });
    playerGroup.add(
      new Mesh(boxGeo, {
        position: new Vector3(15, 15, 0),
        // rotation: new Vector3(0, 0, Math.PI / 4),
        updatesOn: ['perspective', 'resize']
      })
    );
    resolve(playerGroup);
  });
};

export const initTiles = () => {
  return new Promise((resolve) => {
    const tileGroup = new Group({
      uid: 'tile-group',
      style: new Style({
        strokeStyle: 'white',
        lineWidth: () => G.COORDS.SCREEN.getWidth() * 0.0005,
        fillStyle: 'black'
      })
    });
    for (let i = 0; i < G.VISIBLE_MAP_WIDTH; i++) {
      for (let j = 0; j < G.VISIBLE_MAP_HEIGHT; j++) {
        G.CAMERA.isObjectVisible(new Vector3(i, j, 0)) &&
          tileGroup.add(
            new Mesh(squareGeo, {
              position: new Vector3(i, j, 0)
            })
          );
      }
    }
    tileGroup.children[50].cache().then(() => {
      resolve(tileGroup);
    });
  });
};

export const initTestCubes = () => {
  return new Promise((resolve) => {
    const cubeGroup = new Group({
      uid: 'test-cubes',
      style: new Style({
        fillStyle: G.COLORS.LILAC,
        strokeStyle: 'white',
        lineWidth: 10,
        lineJoin: 'round',
        lineCap: 'round'
      })
    });
    const cubeGeo = new BoxGeometry();
    cubeGroup.add([
      new Mesh(cubeGeo, {
        position: new Vector3(10, 15, 0)
      }),
      new Mesh(cubeGeo, {
        position: new Vector3(15, 10, 0)
      }),
      new Mesh(cubeGeo, {
        position: new Vector3(15, 20, 0)
      }),
      new Mesh(cubeGeo, {
        position: new Vector3(20, 15, 0)
      })
    ]);
    resolve(cubeGroup);
  });
};
