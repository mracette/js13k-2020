import { G } from '../globals';
import { Mesh } from '../core/Mesh';
import { Group } from '../core/Group';
import { Vector3 } from '../core/Vector3';
import * as geos from '../entities/geometries';
import * as styles from '../entities/styles';

export class Map {
  constructor() {
    this.height = 31; // rows; must be odd
    this.width = 31; // columns; must be odd
    this.halfWidth = (this.width - 1) / 2;
    this.halfHeight = (this.height - 1) / 2;
    this.visibleHeight = 9;
    this.visibleWidth = 3;
    this.grid = [];
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

  // this is beyond explanation, sorry
  // (the mapping of the map?)
  getGridFromTile(x, y) {
    let row = -1 * [x + y];
    let col;
    let colOffset;
    const midX = -1 * (row / 2);
    if (row % 2 === 0) {
      colOffset = x - midX;
    } else {
      colOffset = x;
    }
    col = this.halfWidth + colOffset;
    return [row, col];
  }

  // this is beyond explanation, sorry
  // (the mapping of the map?)
  getEntityOnTile(x, y) {
    const [row, col] = this.getGridFromTile(x, y);
    // console.log(x, y, row, col, this.grid);
    if (row < 0 || row > this.height - 1 || col < 0 || col > this.width - 1) {
      return null;
    } else {
      return this.grid[row][col].entity;
    }
  }

  getEntity(name) {
    return this._entities[name];
  }

  initTileGroup() {
    this._entities.tileGroup = new Group(null, {
      uid: 'tile-group',
      style: styles.baseLineStyle
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

    this._entities.tree001 = (opts) => {
      const trunk = new Mesh(geos.trunk, { style: styles.brown });
      const tree001 = new Mesh(geos.tree001, { style: styles.emeraldGreen });
      return new Group([trunk, tree001], opts);
    };
    this._entities.tree002 = (opts) => {
      const trunk = new Mesh(geos.trunk, { style: styles.brown });
      const tree002 = new Mesh(geos.tree002, { style: styles.emeraldGreen });
      return new Group([trunk, tree002], opts);
    };
    this._entities.tree003 = (opts) => {
      const trunk = new Mesh(geos.trunk, { style: styles.brown });
      const tree003 = new Mesh(geos.tree003, { style: styles.emeraldGreen });
      return new Group([trunk, tree003], opts);
    };

    /* rocks */
    const rock = new Mesh(geos.rock, { style: styles.grey });
    this._entities.rock = (opts) => {
      return new Mesh(geos.rock, { ...opts, style: styles.grey });
    };

    /* tiles */
    const tile = this.initTileGroup();

    /* caching */
    this._cachedEntities.push(trunk, tree001, tree002, tree003, rock, tile);
  }

  cacheEntities() {
    const promises = [];
    this._cachedEntities.forEach((ent) => {
      promises.push(ent.cache());
    });
    return Promise.all(promises);
  }

  _initGrid() {
    console.log(this._entities);
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
    if (row <= 2 || col <= 0 || col >= this.width - 1) {
      return rock(position);
    }
    if (rand < 0.25 && (row <= 6 || col <= 1 || col >= this.width - 2)) {
      return rock(position);
    }
    return null;
  }
}
