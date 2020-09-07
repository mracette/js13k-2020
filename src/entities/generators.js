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
make.rock = (opts) => new Mesh(geos.rock, { ...opts, style: styles.grey2 });
make.box = (opts) => new Mesh(geos.box, { ...opts, style: styles.purple1 });
make.water = (opts) =>
  new Mesh(geos.square, {
    ...opts,
    style: styles.waterBlue
  });
make.sand = (opts) =>
  new Mesh(geos.square, {
    ...opts,
    style: styles.sand
  });
make.field = (opts) =>
  new Mesh(geos.square, {
    ...opts,
    style: styles.emeraldGreen
  });
make.starfish = (opts) =>
  new Group(
    [
      make.sand(),
      new Mesh(geos.starfish, {
        style: styles.orange1
      })
    ],
    opts
  );
make.shell = (opts) =>
  new Group(
    [
      make.sand(),
      new Mesh(geos.shell, {
        style: styles.grey1
      })
    ],
    opts
  );
make.tile = (opts) =>
  new Mesh(geos.square, {
    ...opts,
    style: [styles.raisinBlack, styles.lightLine]
  });
make.tileGroup = () => {
  const group = new Group();
  for (let i = 0, w = G.CAMERA.getVisibleMapWidth(); i <= w; i++) {
    for (let j = 0, h = G.CAMERA.getVisibleMapHeight(); j <= h; j++) {
      group.add(
        make.tile({
          position: new Vector3(i - w / 2 - 0.5, j - h / 2 - 0.5, 0)
        })
      );
    }
  }
  return group;
};
