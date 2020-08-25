import { Style } from '../core/Style';

export const RAISIN_BLACK = '#272838';
export const LIGHT_GRAY = '#CCCCCC';
export const LILAC = '#7C77B9';
export const EMERALD_GREEN = '#5BBA6F';
export const WHITE_OVERLAY_02 = 'rgba(255, 255, 255, .2)';

export const baseLineStyle = new Style({
  strokeStyle: 'white',
  lineWidth: 2,
  lineJoin: 'round',
  lineCap: 'round'
});
export const emeraldGreen = new Style({
  fillStyle: EMERALD_GREEN
});
export const lilac = new Style({
  fillStyle: LILAC
});
export const raisinBlack = new Style({
  fillStyle: RAISIN_BLACK
});
export const brown = new Style({
  fillStyle: 'brown'
});
export const grey = new Style({
  fillStyle: 'grey'
});
