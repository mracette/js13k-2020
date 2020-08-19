import { G } from '../globals';
import { AStar } from '../algos/movement';

export class Map {
  constructor(opts) {
    this.grid = [];
    this.nodes = [];
    this.diagonal = !!opts.diagonal;
    for (let i = 0; i < G.VISIBLE_MAP_WIDTH; i++) {
      this.grid[i] = [];
      for (let j = 0; j < G.VISIBLE_MAP_HEIGHT; j++) {
        const node = new MapNode(i, j);
        this.grid[i][j] = node;
        this.nodes.push(node);
      }
    }
    this.init();
  }
  init() {
    this.dirtyNodes = [];
    for (let i = 0; i < this.nodes.length; i++) {
      AStar.cleanNode(this.nodes[i]);
    }
  }
  cleanDirty() {
    for (let i = 0; i < this.dirtyNodes.length; i++) {
      AStar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
  }
  markDirty(node) {
    this.dirtyNodes.push(node);
  }
  neighbors(node) {
    const neighbors = [];
    const x = node.x;
    const y = node.y;
    const grid = this.grid;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      neighbors.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      neighbors.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
      neighbors.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
      neighbors.push(grid[x][y + 1]);
    }

    if (this.diagonal) {
      // Southwest
      if (grid[x - 1] && grid[x - 1][y - 1]) {
        neighbors.push(grid[x - 1][y - 1]);
      }

      // Southeast
      if (grid[x + 1] && grid[x + 1][y - 1]) {
        neighbors.push(grid[x + 1][y - 1]);
      }

      // Northwest
      if (grid[x - 1] && grid[x - 1][y + 1]) {
        neighbors.push(grid[x - 1][y + 1]);
      }

      // Northeast
      if (grid[x + 1] && grid[x + 1][y + 1]) {
        neighbors.push(grid[x + 1][y + 1]);
      }
    }
    return neighbors;
  }
}

export class MapNode {
  constructor(x, y, weight = 1) {
    Object.assign(this, { x, y, weight });
  }
  isWall() {
    return this.weight === 0;
  }
  getCost(fromNeighbor) {
    // Take diagonal weight into consideration.
    // TODO: this may skew the cost in iso projection
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }
}
