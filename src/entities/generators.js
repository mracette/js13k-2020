import { G } from '../globals';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Group } from '../core/Group';
import * as styles from './styles';
import * as geos from './geometries';

export const trunk = () => new Mesh(geos.trunk, { style: styles.brown });
export const trunkBase = () =>
  new Mesh(geos.shadow, {
    position: new Vector3(0, 0, 0),
    style: styles.ivoryBlack
  });
export const treeTop1 = () =>
  new Mesh(geos.tree1, { style: styles.emeraldGreen });
export const treeTop2 = () =>
  new Mesh(geos.tree2, { style: styles.emeraldGreen });
export const treeTop3 = () =>
  new Mesh(geos.tree3, { style: styles.emeraldGreen });
export const tree1 = (opts) =>
  new Group([trunkBase(), trunk(), treeTop1()], opts);
export const tree2 = (opts) =>
  new Group([trunkBase(), trunk(), treeTop2()], opts);
export const tree3 = (opts) =>
  new Group([trunkBase(), trunk(), treeTop3()], opts);
export const grass = (opts) =>
  new Mesh(geos.grass, { ...opts, style: styles.grassGreen });
export const rock = (opts) =>
  new Mesh(geos.rock, { ...opts, style: styles.grey });
export const stream = (opts) =>
  new Mesh(geos.streamFull, {
    ...opts,
    style: [styles.clearLine, styles.streamBlue]
  });
export const tileGroup = () => {
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
