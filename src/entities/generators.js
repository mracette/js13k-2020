import { G } from '../globals';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Group } from '../core/Group';
import * as styles from './styles';
import * as geos from './geometries';

export const make = {};

/* primitives */
make.pyramid = (opts) => new Mesh(geos.pyramid, opts);
make.square = (opts) => new Mesh(geos.square, opts);
make.box = (opts) => new Mesh(geos.box, opts);
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

/* special tiles */
make.whiteTile = (opts) =>
  new Mesh(geos.square, {
    ...opts,
    style: [styles.transparentWhite, styles.lightLine]
  });

/* trees */
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

/* environment */
make.grass = (opts) =>
  new Mesh(geos.grass, { ...opts, style: styles.grassGreen });
make.stream = (opts) =>
  new Mesh(geos.square, { ...opts, style: styles.waterBlue });
make.bridge = (opts) => new Mesh(geos.square, { ...opts, style: styles.brown });
make.rock = (opts) => new Mesh(geos.rock, { ...opts, style: styles.grey2 });

/* player */
make.playerShadow = () =>
  new Mesh(geos.shadow, {
    style: [styles.transparentBlack, styles.clearLine]
  });
make.playerBody = () =>
  new Mesh(geos.playerBody, {
    style: styles.purple1
  });
make.playerFace = () =>
  new Mesh(geos.playerFace, {
    style: styles.magnolia,
    position: new Vector3(0.5, 0.5, 0),
    cacheEnabled: false
  });
make.playerRingFront = () =>
  new Mesh(geos.playerRingFront, {
    style: [styles.green1]
  });
make.playerRingBack = () =>
  new Mesh(geos.playerRingBack, {
    style: [styles.green1]
  });
make.playerLower = () =>
  new Group([
    make.playerShadow(),
    make.playerRingBack(),
    make.playerBody(),
    make.playerRingFront()
  ]);
make.player = (opts) =>
  new Group([make.playerLower(), make.playerFace()], {
    ...opts
  });

/* town */
make.building = (opts = {}) =>
  new Group(
    [
      make.box({ scale: new Vector3(2, 2, 2), style: opts.style || [] }),
      make.pyramid({
        scale: new Vector3(2, 2, 1),
        position: new Vector3(0, 0, 2 + (opts.scale ? opts.scale.z : 0)),
        style: styles.brown
      })
    ],
    {
      position: opts.position,
      scale: opts.scale,
      style: [styles.baseLine, styles.thickLine, styles.darkLine]
    }
  );
