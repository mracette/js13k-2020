import { G } from '../globals';
import { Group } from '../core/Group';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Style } from '../core/Style';
import * as geos from '../geometries/shapes';

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

export const initTree001 = () => {
  const tree001Group = new Group({
    style: new Style({
      fillStyle: G.COLORS.EMERALD_GREEN,
      strokeStyle: 'white',
      lineWidth: 2,
      lineJoin: 'round',
      lineCap: 'round'
    })
  });
  tree001Group.add([
    new Mesh(geos.tree001, { position: new Vector3(5, 10, 0) }),
    new Mesh(geos.tree001, { position: new Vector3(8, 13, 0) }),
    new Mesh(geos.tree001, { position: new Vector3(15, 18, 0) }),
    new Mesh(geos.tree001, { position: new Vector3(9, 21, 0) })
  ]);
  return tree001Group;
};

export const initHoverTile = () => {
  return new Mesh(geos.square, {
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
    const playerGroup = new Group({
      position: new Vector3(15, 15, 0),
      uid: 'player-group'
    });
    playerGroup.style = new Style({
      fillStyle: G.COLORS.EMERALD_GREEN,
      strokeStyle: 'white',
      lineWidth: 2,
      lineJoin: 'round',
      lineCap: 'round'
    });
    playerGroup.add(
      new Mesh(geos.box, {
        // rotation: new Vector3(0, 0, Math.PI / 4),
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
        fillStyle: G.COLORS.RAISIN_BLACK
      })
    });
    for (let i = 0; i < G.VISIBLE_MAP_WIDTH; i++) {
      for (let j = 0; j < G.VISIBLE_MAP_HEIGHT; j++) {
        tileGroup.add(
          new Mesh(geos.square, {
            position: new Vector3(
              i - G.VISIBLE_MAP_WIDTH / 2,
              j - G.VISIBLE_MAP_HEIGHT / 2,
              0
            )
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
        lineWidth: 2,
        lineJoin: 'round',
        lineCap: 'round'
      })
    });
    cubeGroup.add([
      new Mesh(geos.box, {
        scale: new Vector3(1, 2, 2),
        position: new Vector3(10, 15, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(0.5, 0.5, 1),
        position: new Vector3(15, 10, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(0.5, 0.5, 0.5),
        position: new Vector3(15, 10.5, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(0.5, 0.5, 0.5),
        position: new Vector3(15.5, 10, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(0.5, 4, 0.5),
        position: new Vector3(21, 10, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(0.5, 0.5, 0.5),
        position: new Vector3(15.5, 10, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(0.5, 0.5, 0.5),
        position: new Vector3(15.5, 10.5, 0)
      }),
      new Mesh(geos.box, {
        scale: new Vector3(3, 1, 1),
        rotation: new Vector3(0, 0, -Math.PI / 8),
        position: new Vector3(15, 20, 0)
      }),
      new Mesh(geos.box, {
        position: new Vector3(20, 15, 0)
      })
    ]);
    resolve(cubeGroup);
  });
};
