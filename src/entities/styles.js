import { G } from '../globals';
import { Style } from '../core/Style';
import { Group } from '../core/Group';

/* LINES */
export const baseLine = new Style({
  lineWidth: () => G.COORDS.width(0.001),
  lineJoin: 'round',
  lineCap: 'round'
});
export const thickLine = new Style({
  lineWidth: () => G.COORDS.width(0.003)
});
export const darkLine = new Style({
  strokeStyle: 'black'
});
export const lightLine = new Style({
  strokeStyle: 'white'
});
export const clearLine = new Style({
  strokeStyle: 'rgba(0,0,0,0)'
});

/* OVERLAYS */
export const transparentBlack = new Style({
  fillStyle: 'rgba(0,0,0,.25)'
});
export const transparentWhite = new Style({
  fillStyle: 'rgba(255,255,255,.25)'
});

// ENVIRONMENT
export const waterBlue = new Style({
  fillStyle: '#2E86AB',
  uid: 'waterBlue'
});
export const emeraldGreen = new Style({
  fillStyle: '#5BBA6F'
});
export const grassGreen = new Style({
  fillStyle: '#137547'
});
export const raisinBlack = new Style({
  fillStyle: '#272838'
});
export const hazyPurple = new Style({
  fillStyle: 'purple'
});
// OTHER
export const magnolia = new Style({
  fillStyle: '#F7F0F5',
  uid: 'magnolia'
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
export const sand = new Style({
  fillStyle: '#E7C496'
});
export const orange1 = new Style({
  fillStyle: '#E3DBDB'
});
export const grey1 = new Style({
  fillStyle: '#F7F8F8'
});
export const grey2 = new Style({
  fillStyle: 'grey'
});
export const grey3 = new Style({
  fillStyle: '#52595F'
});
export const green1 = new Style({
  fillStyle: '#94C595'
});
export const green2 = new Style({
  fillStyle: '#3ECAAC'
});
export const green3 = new Style({
  fillStyle: '#2D675F'
});
export const purple1 = new Style({
  fillStyle: '#7C77B9'
});
export const purple2 = new Style({
  fillStyle: '#8B5DCE'
});

export const globalStyles = new Group(null, {
  style: [baseLine, clearLine]
});
