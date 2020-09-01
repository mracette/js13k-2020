import { G } from '../globals';
import { Style } from '../core/Style';
import { Group } from '../core/Group';

export const RAISIN_BLACK = '#272838';
export const LIGHT_GRAY = '#CCCCCC';
export const LILAC = '#7C77B9';
export const EMERALD_GREEN = '#5BBA6F';
export const WHITE_OVERLAY_02 = 'rgba(255, 255, 255, .2)';

export const baseLine = new Style({
  lineWidth: () => G.COORDS.width(0.001),
  strokeStyle: 'rgba(255,255,255,0)',
  lineJoin: 'round',
  lineCap: 'round'
});
export const clearLine = new Style({
  strokeStyle: 'rgba(0,0,0,0)'
});
export const lightLine = new Style({
  strokeStyle: 'rgba(0,0,0,.25)'
});
export const transparentBlack = new Style({
  fillStyle: 'rgba(0,0,0,.25)'
});
export const spaceCadet = new Style({
  fillStyle: '#94C595'
});
export const streamBlue = new Style({
  fillStyle: '#2E86AB'
});
export const emeraldGreen = new Style({
  fillStyle: EMERALD_GREEN
});
export const grassGreen = new Style({
  fillStyle: '#137547'
});
export const lilac = new Style({
  fillStyle: LILAC
});
export const raisinBlack = new Style({
  fillStyle: RAISIN_BLACK
});
export const magnolia = new Style({
  fillStyle: '#F7F0F5'
});
export const brown = new Style({
  fillStyle: '#8B5742'
});
export const darkBrown = new Style({
  fillStyle: '#5C4033'
});
export const ivoryBlack = new Style({
  fillStyle: '#292421'
});
export const grey = new Style({
  fillStyle: 'grey'
});

export const globalStyles = new Group(null, {
  style: [baseLine]
});
