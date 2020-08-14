import { MAP_SIZE } from '../globals';

export const MAP = [];

// initializing a MAP_SIZE x MAP_SIZE grid
for (let i = 0; i < MAP_SIZE; i++) {
  for (let j = 0; j < MAP_SIZE; j++) {
    MAP.push([i, j]);
  }
}
