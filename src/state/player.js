import { G } from '../globals';
import { MapNode } from '../algos/movement';
import { pageToCanvas } from '../utils/conversions';

export const updatePathToHoverTile = (fromObject) => {
  try {
    const path = G.ASTAR.search(G.MAP, fromObject, G.MOUSE_HOVER);
    G.PATHS.PLAYER_TO_HOVER = path;
  } catch {}
};

class Player {
  constructor() {
    this.position = new MapNode(9, 9);
  }
}
