import { G } from '../globals';
import { Vector3 } from '../core/Vector3';
import { globalStyles } from '../entities/styles';
import { make } from '../entities/generators';

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
    this._initWorld();
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

  cacheEntities() {
    const promises = [];
    Object.entries(make).forEach((generator) => {
      const entityName = generator[0];
      const entity = generator[1]();
      entity && globalStyles.add(entity);
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

  _initEntity(name, position, blocks) {
    return {
      entity: make[name]({ position }),
      blocks
    };
  }

  _initEntityOnGrid(row, col) {
    const rand = Math.random();
    const [x, y] = this.getTileFromGrid(row, col);
    const position = new Vector3(x, y, 0);
    if (col > 8 && col < 12) {
      return this._initEntity('stream', position, true);
    }
    if (row <= 2 || col <= 0 || col >= this.width - 1) {
      return this._initEntity('rock', position, true);
    }
    if (rand < 0.25 && (row <= 6 || col <= 1 || col >= this.width - 2)) {
      return this._initEntity('rock', position, true);
    }
    if (rand < 0.15) {
      return this._initEntity('grass', position, true);
    } else if (rand < 0.2) {
      return this._initEntity('tree1', position, true);
    } else if (rand < 0.25) {
      return this._initEntity('tree2', position, true);
    } else if (rand < 0.3) {
      return this._initEntity('tree3', position, true);
    }
    return null;
  }
}
