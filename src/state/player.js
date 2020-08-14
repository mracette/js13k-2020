import { G } from '../globals';
import { MapNode } from '../state/map';
import { isoToMap, orthoToMap, pageToCanvas } from '../utils/conversions';

export const PLAYER = new Player();

export const updatePathToHoverTile = () => {
  const path = G.ASTAR.search(G.MAP, PLAYER.position, G.MOUSE_HOVER);
  G.PATHS.PLAYER_TO_HOVER = path;
};

export const updatePlayerPosition = (e, iso = G.ISO) => {
  const [cx, cy] = pageToCanvas(e);
  const [mx, my] = iso ? isoToMap(cx, cy, false) : orthoToMap(cx, cy, false);
  PLAYER.position.x = Math.floor(mx);
  PLAYER.position.y = Math.floor(my);
};

class Player {
  constructor() {
    this.position = new MapNode(9, 9);
  }
}
