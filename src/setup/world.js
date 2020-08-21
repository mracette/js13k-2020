import { G } from '../globals';
import { Group } from '../core/Group';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Style } from '../core/Style';
import * as geos from '../geometries/shapes';

export const pathToHover = (styles) => {
  return new Group({
    uid: 'path-to-hover',
    style: styles.emeraldGreen
  });
};

export const allTrees = (styles) => {
  const treeGroup = (type, opts) => {
    const name = 'tree-group';
    const group = new Group({ name, ...opts });
    const trunk = new Mesh(geos.trunk, { style: styles.brown });
    const tree = new Mesh(geos['tree' + type], { style: styles.emeraldGreen });
    group.add([trunk, tree]);
    return group;
  };
  const allTreesGroup = new Group(styles, { name: 'all-trees' });
  allTreesGroup.add([
    treeGroup('001', { position: new Vector3(5, 10, 0) }),
    treeGroup('002', { position: new Vector3(8, 13, 0) }),
    treeGroup('003', { position: new Vector3(15, 18, 0) }),
    treeGroup('002', { position: new Vector3(9, 21, 0) }),
    treeGroup('003', { position: new Vector3(17, 21, 0) }),
    treeGroup('001', { position: new Vector3(25, 15, 0) }),
    treeGroup('002', { position: new Vector3(19, 12, 0) }),
    treeGroup('003', { position: new Vector3(23, 18, 0) }),
    treeGroup('001', { position: new Vector3(22, 6, 0) })
  ]);
  return allTreesGroup;
};

export const player = (styles) => {
  const playerGroup = new Group({
    position: new Vector3(15, 15, 0),
    uid: 'player-group',
    style: styles.emeraldGreen
  });
  playerGroup.add(new Mesh(geos.box));
  return playerGroup;
};

export const hoverTile = (styles) => {
  return new Mesh(geos.square, {
    autoCache: true,
    style: styles.emeraldGreen
  });
};

export const tiles = (styles) => {
  return new Promise((resolve) => {
    const tileGroup = new Group({
      uid: 'tile-group',
      style: styles.raisinBlack
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

export const testCubes = (styles) => {
  const cubeGroup = new Group({
    uid: 'test-cubes',
    style: styles.lilac
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
  return cubeGroup;
};
