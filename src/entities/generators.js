import { G } from '../globals';
import { Mesh } from '../core/Mesh';
import { Vector3 } from '../core/Vector3';
import { Group } from '../core/Group';
import * as styles from './styles';
import * as geos from './geometries';

export const make = {};

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
make.rock = (opts) => new Mesh(geos.rock, { ...opts, style: styles.grey2 });
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

/* beach objects */
make.starfishMesh = () =>
  new Mesh(geos.starfish, {
    style: styles.orange1
  });
make.starfish = (opts) => new Group([make.sand(), make.starfishMesh()], opts);
make.shellMesh = () =>
  new Mesh(geos.shell, {
    style: styles.grey1
  });
make.shell = (opts) => new Group([make.sand(), make.shellMesh()], opts);

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
make.boxOne = () =>
  new Mesh(geos.box, {
    scale: new Vector3(2, 2, 1)
    // position: new Vector3(3, 3, 0)
  });
make.boxTwo = () => new Mesh(geos.box, { scale: new Vector3(2, 2, 2) });
make.inn = (opts) =>
  new Group([make.boxOne()], {
    style: styles.purple2,
    ...opts
  });
