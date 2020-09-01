import { G } from '../globals';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Group } from '../core/Group';
import * as styles from './styles';
import * as geos from './geometries';

export const make = {};
make.trunk = () => new Mesh(geos.trunk, { style: styles.brown });
make.trunkBase = () =>
  new Mesh(geos.shadow, {
    position: new Vector3(0, 0, 0),
    style: styles.ivoryBlack
  });
make.treeTop1 = () => new Mesh(geos.tree1, { style: styles.emeraldGreen });
make.treeTop2 = () => new Mesh(geos.tree2, { style: styles.emeraldGreen });
make.treeTop3 = () => new Mesh(geos.tree3, { style: styles.emeraldGreen });
make.tree1 = (opts) =>
  new Group([make.trunkBase(), make.trunk(), make.treeTop1()], opts);
make.tree2 = (opts) =>
  new Group([make.trunkBase(), make.trunk(), make.treeTop2()], opts);
make.tree3 = (opts) =>
  new Group([make.trunkBase(), make.trunk(), make.treeTop3()], opts);
make.grass = (opts) =>
  new Mesh(geos.grass, { ...opts, style: styles.grassGreen });
make.rock = (opts) => new Mesh(geos.rock, { ...opts, style: styles.grey });
make.stream = (opts) =>
  new Mesh(geos.streamFull, {
    ...opts,
    style: [styles.clearLine, styles.streamBlue]
  });
make.tileGroup = () => {
  const group = new Group(null, {
    style: [styles.raisinBlack, styles.lightLine]
  });
  for (let i = 0; i < G.VISIBLE_MAP_WIDTH; i++) {
    for (let j = 0; j < G.VISIBLE_MAP_HEIGHT; j++) {
      group.add(
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
  return group;
};
