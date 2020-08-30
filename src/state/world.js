import { G } from '../globals';
import { Mesh } from '../core/Mesh';
import { Group } from '../core/Group';
import { Vector3 } from '../core/Vector3';
import * as geos from '../entities/geometries';
import * as styles from '../entities/styles';

export class Map {
  constructor() {
    this.height = 196; // rows; must be odd
    this.width = 31; // columns; must be odd
    this.halfWidth = (this.width - 1) / 2;
    this.halfHeight = (this.height - 1) / 2;
    this.visibleHeight = 9;
    this.visibleWidth = 3;
    this.grid = [];
    this.visibleGridSize = this.getGridFromTile(
      Math.round((-1 * G.VISIBLE_MAP_WIDTH) / 2),
      Math.round((-1 * G.VISIBLE_MAP_HEIGHT) / 2)
    );
    this.visibleGridSizeHalf = [
      Math.round(this.visibleGridSize[0] / 2),
      Math.round(this.visibleGridSize[1] / 2)
    ];
    this._entities = {};
    this._cachedEntities = [];
    this._initEntities();
    this._initGrid();
  }

  getVisibleRange(position) {
    this.getTileFromGrid;
  }

  getTileFromGrid(row, col) {
    // determines the mid-point
    const colOffset = col - this.halfWidth;
    const halfWay = row / 2;
    let baseX;
    let baseY;
    if (row % 2 === 0) {
      // halving the row number to get equal "far-back-ness"
      baseX = (-1 * row) / 2;
      baseY = baseX;
    } else {
      // floor vs ceil determines the "tilt"
      baseX = -1 * Math.floor(halfWay);
      baseY = -1 * Math.ceil(halfWay);
    }
    return [baseX + colOffset, baseY - colOffset];
  }

  getGridFromTile(x, y) {
    let row = -1 * [x + y];
    let col;
    let colOffset;
    if (row % 2 === 0) {
      const midX = -1 * (row / 2);
      colOffset = x - midX;
    } else {
      const midX = (-1 * (row + 1)) / 2;
      colOffset = x - midX;
    }
    col = this.halfWidth + colOffset;
    return [row, col];
  }

  getEntity(name) {
    return this._entities[name];
  }

  initTileGroup() {
    this._entities.tileGroup = new Group(null, {
      uid: 'tile-group',
      style: [styles.baseLine, styles.lightLine]
    });
    for (let i = 0; i < G.VISIBLE_MAP_WIDTH; i++) {
      for (let j = 0; j < G.VISIBLE_MAP_HEIGHT; j++) {
        this._entities.tileGroup.add(
          new Mesh(geos.square, {
            style: styles.raisinBlack,
            position: new Vector3(
              i - G.VISIBLE_MAP_WIDTH / 2,
              j - G.VISIBLE_MAP_HEIGHT / 2,
              0
            )
          })
        );
      }
    }
    return this._entities.tileGroup.children[0];
  }

  _initEntities() {
    /* trees */
    const tree002 = new Mesh(geos.tree002, { style: styles.emeraldGreen });
    const tree003 = new Mesh(geos.tree003, { style: styles.emeraldGreen });
    const tree001 = new Mesh(geos.tree001, { style: styles.emeraldGreen });
    const trunk = new Mesh(geos.trunk, { style: styles.brown });
    const trunkBase = new Mesh(geos.shadow, {
      scale: new Vector3(0.5, 0.5, 1),
      position: new Vector3(0.25, 0.25, 0),
      style: styles.ivoryBlack
    });

    this._entities.tree001 = (opts) => {
      const trunkBase = new Mesh(geos.shadow, {
        scale: new Vector3(0.5, 0.5, 1),
        position: new Vector3(0.25, 0.25, 0),
        style: styles.ivoryBlack
      });
      const trunk = new Mesh(geos.trunk, { style: styles.brown });
      const tree001 = new Mesh(geos.tree001, { style: styles.emeraldGreen });
      return new Group([trunkBase, trunk, tree001], opts);
    };
    this._entities.tree002 = (opts) => {
      const trunkBase = new Mesh(geos.shadow, {
        scale: new Vector3(0.5, 0.5, 1),
        position: new Vector3(0.25, 0.25, 0),
        style: styles.ivoryBlack
      });
      const trunk = new Mesh(geos.trunk, { style: styles.brown });
      const tree002 = new Mesh(geos.tree002, { style: styles.emeraldGreen });
      return new Group([trunkBase, trunk, tree002], opts);
    };
    this._entities.tree003 = (opts) => {
      const trunkBase = new Mesh(geos.shadow, {
        scale: new Vector3(0.5, 0.5, 1),
        position: new Vector3(0.25, 0.25, 0),
        style: styles.ivoryBlack
      });
      const trunk = new Mesh(geos.trunk, { style: styles.brown });
      const tree003 = new Mesh(geos.tree003, { style: styles.emeraldGreen });
      return new Group([trunkBase, trunk, tree003], opts);
    };

    /* foliage */
    const grass = new Mesh(geos.grass, { style: styles.grassGreen });
    this._entities.grass = (opts) => {
      return new Mesh(geos.grass, { ...opts, style: styles.grassGreen });
    };

    /* rocks */
    const rock = new Mesh(geos.rock, { style: styles.grey });
    this._entities.rock = (opts) => {
      return new Mesh(geos.rock, { ...opts, style: styles.grey });
    };

    /* stream */
    const streamFull = new Mesh(geos.streamFull, {
      style: [styles.noLine, styles.streamBlue]
    });
    this._entities.streamFull = (opts) =>
      new Mesh(geos.streamFull, {
        ...opts,
        style: [styles.noLine, styles.streamBlue]
      });

    /* tiles */
    const tile = this.initTileGroup();

    /* caching */
    this._cachedEntities.push(
      trunk,
      trunkBase,
      tree001,
      tree002,
      tree003,
      grass,
      rock,
      tile,
      streamFull
    );
  }

  cacheEntities() {
    const promises = [];
    this._cachedEntities.forEach((ent) => {
      promises.push(ent.cache());
    });
    return Promise.all(promises);
  }

  _initGrid() {
    for (let i = 0; i < this.height; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.width; j++) {
        const entity = this._initEntityOnGrid(i, j);
        this.grid[i][j] = entity;
      }
    }
  }

  _initEntityOnGrid(row, col) {
    const rand = Math.random();
    const [x, y] = this.getTileFromGrid(row, col);
    const position = new Vector3(x, y, 0);
    const rock = (position) => ({
      entity: this._entities.rock({ position }),
      blocks: true
    });
    const grass = (position) => ({
      entity: this._entities.grass({ position }),
      blocks: false
    });
    const tree001 = (position) => ({
      entity: this._entities.tree001({ position }),
      blocks: false
    });
    const tree002 = (position) => ({
      entity: this._entities.tree002({ position }),
      blocks: false
    });
    const tree003 = (position) => ({
      entity: this._entities.tree003({ position }),
      blocks: false
    });
    const streamFull = (position) => ({
      entity: this._entities.streamFull({ position }),
      blocks: true
    });
    if (col > 8 && col < 12) {
      return streamFull(position);
    }
    if (row <= 2 || col <= 0 || col >= this.width - 1) {
      return rock(position);
    }
    if (rand < 0.25 && (row <= 6 || col <= 1 || col >= this.width - 2)) {
      return rock(position);
    }
    if (rand < 0.15) {
      return grass(position);
    } else if (rand < 0.2) {
      return tree001(position);
    } else if (rand < 0.25) {
      return tree002(position);
    } else if (rand < 0.3) {
      return tree003(position);
    }
    return null;
  }
}
