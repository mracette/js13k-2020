import { G } from '../globals';
import { MapNode } from '../state/map';
import { isoToMap, orthoToMap, pageToCanvas } from '../utils/conversions';

export const updatePathToHoverTile = (fromObject) => {
  const path = G.ASTAR.search(G.MAP, fromObject, G.MOUSE_HOVER);
  G.PATHS.PLAYER_TO_HOVER = path;
};

export const updatePlayerPosition = (e, player, iso = G.ISO) => {
  const [cx, cy] = pageToCanvas(e);
  const [mx, my] = iso ? isoToMap(cx, cy, false) : orthoToMap(cx, cy, false);
  player.position.x = Math.floor(mx);
  player.position.y = Math.floor(my);
};

class Player {
  constructor() {
    this.position = new MapNode(9, 9);
  }
}
