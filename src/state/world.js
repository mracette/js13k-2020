import { G } from '../globals';
import { Vector3 } from '../core/Vector3';
import { globalStyles } from '../entities/styles';
import { RAND } from '../utils/functions';
import { make } from '../entities/generators';
import * as styles from '../entities/styles';

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
    if (G.CACHE) {
      Object.entries(make).forEach((generator) => {
        const entityName = generator[0];
        const entity = generator[1]();
        globalStyles.add(entity);
        this._entities[entityName] = entity;
        if (entity.type === 'mesh') {
          promises.push(entity.cache());
        }
      });
    }
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

  _initEntity(name, opts, type) {
    return {
      entity: make[name](opts),
      type
    };
  }

  _initEntityOnGrid(row, col) {
    const r = RAND();
    const [x, y] = this.getTileFromGrid(row, col);
    const position = new Vector3(x, y, 0);

    // world-wide rock border (L + R)
    if (col <= 1 || col >= this.width - 2 || row <= 2)
      return this._initEntity('rock', { position }, 'blocks');

    /* THE TOWN */
    // house
    if (row === 25 && col === 11)
      return this._initEntity(
        'building',
        { position, style: styles.green1 },
        false
      );
    if ((row === 25 && col === 12) || (row === 24 && col === 11))
      return this._initEntity('whiteTile', { position }, 'home');

    // rock border
    if (row <= 30 && row > 27 && (col < 14 || col > 16))
      return this._initEntity('rock', { position }, 'blocks');

    // random grass
    if (row <= 22 && col > 1 && col < this.width - 2 && r < 0.03) {
      return this._initEntity('grass', { position });
    }

    return null;
  }
}
