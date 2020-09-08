import { G } from '../globals';
import { Vector3 } from '../core/Vector3';
import { globalStyles } from '../entities/styles';
import { RAND } from '../utils/math';
import { make } from '../entities/generators';

export class Map {
  constructor() {
    this.height = 195; // rows; must be odd
    this.width = 31; // columns; must be odd
    this.halfWidth = (this.width - 1) / 2;
    this.halfHeight = (this.height - 1) / 2;
    this.visibleHeight = 9;
    this.visibleWidth = 3;
    this.grid = [];
    this.visibleGridSizeHalf = this.getGridFromTile(
      Math.round((-1 * G.CAMERA.getVisibleMapWidth()) / 4),
      Math.round((-1 * G.CAMERA.getVisibleMapHeight()) / 4)
    );
    this._entities = {};
    this._initWorld();
  }

  getEntityOnGrid(i, j) {
    if (i >= 0 && i < G.MAP.height && j >= 0 && j < G.MAP.width) {
      return this.grid[i][j];
    }
    return false;
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
      baseX = -1 * Math.ceil(halfWay);
      baseY = -1 * Math.floor(halfWay);
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

  cacheEntities() {
    const promises = [];
    Object.entries(make).forEach((generator) => {
      const entityName = generator[0];
      const entity = generator[1]();
      globalStyles.add(entity);
      this._entities[entityName] = entity;
      if (entity.type === 'mesh') {
        promises.push(entity.cache());
      }
    });
    return Promise.all(promises);
  }

  _initWorld() {
    for (let i = 0; i < this.height; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.width; j++) {
        const entity = this._initEntityOnGrid(i, j);
        this.grid[i][j] = entity;
      }
    }
  }

  _initEntity(name, opts, blocks) {
    return {
      entity: make[name](opts),
      blocks
    };
  }

  _initEntityOnGrid(row, col) {
    const rand = RAND();
    const [x, y] = this.getTileFromGrid(row, col);
    const position = new Vector3(x, y, 0);

    // if ((row === 15 || row === 16) && (col === 16 || col === 17)) {
    //   return this._initEntity('sand', { position }, false);
    // }

    /* THE BEACH */
    if (row <= 15) return this._initEntity('water', { position }, true);
    if (row <= 25 && col !== 15 && col > 1 && col < this.width - 2) {
      if (rand < 0.015)
        return this._initEntity('starfish', { position }, false);
      if (rand < 0.03) return this._initEntity('shell', { position }, false);
    }
    if (row <= 26 && col > 1 && col <= this.width - 3)
      return this._initEntity('sand', { position }, false);
    if (row <= 30 && (col < 14 || col > 16))
      return this._initEntity('rock', { position }, true);

    /* THE TOWN */
    if (row === 53 && col === 13)
      return this._initEntity('inn', { position }, true);
    if (row <= 56 && col > 1 && col <= this.width - 3)
      return this._initEntity('field', { position }, false);
    if (row <= 60 && (col < 14 || col > 16))
      return this._initEntity('rock', { position }, true);

    // world-wide rock border (L + R)
    if (col <= 1 || col >= this.width - 2)
      return this._initEntity('rock', { position }, true);
    return null;
  }
}
