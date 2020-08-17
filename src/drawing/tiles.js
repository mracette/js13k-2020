import { G } from '../globals';
import { Point } from '../core/Point';
import { SquareGeometry } from '../geometries/shapes';

export const setStyles = () => {
  G.CTX.strokeStyle = 'white';
  G.CTX.lineWidth = G.COORDS.SCREEN.getWidth() * 0.0005;
  G.CTX.fillStyle = 'black';
};

export const drawTileOutlines = (iso = G.ISO, showCoords = false) => {
  for (let i = 0; i < G.SCREEN_TILES; i++) {
    for (let j = 0; j < G.SCREEN_TILES; j++) {
      const tile = new Square(new Point(i, j, 0));
      G.CAMERA.project(tile, iso);
    }
  }
};
