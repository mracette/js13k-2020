import { rotatePoint, TAU } from 'crco-utils';
import { G } from '../globals';
import { drawLines } from './shapes';
import { box } from '../generative/shapes';
import { mapToIso, mapToOrtho } from '../utils/conversions';
import { degToRad } from '../utils/math';

export class boxObject {
  constructor() {
    this.frontView = box(0, 0, 1, 1);
    this.rightView = this.frontView;
    this.topView = this.frontView;
  }
  render(iso = G.iso, designScale = false, view = false) {
    if (!view || view === 'front') {
      drawLines(
        this.frontView.map((point) => {
          if (iso) {
            const pointX = rotatePoint(point[0], 1, 1, 1, degToRad(45));
            const pointY = rotatePoint(
              pointX.x,
              point[1],
              1,
              1,
              Math.atan(0.5)
            );
            return mapToOrtho(pointX.x, pointY.y);
          } else {
            return mapToOrtho(...point);
          }
        }),
        true,
        false,
        designScale ? G.SCREEN_TILES : false,
        designScale ? G.SCREEN_TILES : false
      );
    }
    if (!view || view === 'right') {
      drawLines(
        this.rightView.map((point) => {
          if (iso) {
            const pointX = rotatePoint(point[0], 1, 0, 1, degToRad(45));
            const pointY = rotatePoint(
              pointX.x + 1,
              point[1],
              1,
              1,
              -degToRad(30)
            );
            return mapToOrtho(1 + pointX.x, pointY.y);
            // return mapToOrtho(1 + pointX.x, (1 + pointY.y) / 2);
          } else {
            return mapToOrtho(...point);
          }
        }),
        true,
        false,
        designScale ? G.SCREEN_TILES : false,
        designScale ? G.SCREEN_TILES : false
      );
    }
    if (!view || view === 'top') {
      drawLines(
        this.topView.map((point) => {
          if (iso) {
            const pointX = rotatePoint(point[0], point[1], 1, 1, degToRad(45));
            return mapToOrtho(pointX.x, (1 + pointX.y) / 2);
          } else {
            return mapToOrtho(...point);
          }
        }),
        true,
        false,
        designScale ? G.SCREEN_TILES : false,
        designScale ? G.SCREEN_TILES : false
      );
    }
  }
}
