import { G } from '../globals';

// ortho <--> map <--> iso

export const mapToOrtho = (x, y) => {
  return [x * G.ORTHO_TILE_WIDTH, y * G.ORTHO_TILE_WIDTH];
};

export const mapToIso = (x, y) => {
  const ix =
    x * G.ISO_TILE_WIDTH_HALF -
    y * G.ISO_TILE_WIDTH_HALF +
    G.COORDS.SCREEN.nx(0);
  const iy = x * G.ISO_TILE_HEIGHT_HALF + y * G.ISO_TILE_HEIGHT_HALF;
  return [ix, iy];
};

export const orthoToMap = (x, y, round = false) => {
  console.log(x, y, G.ORTHO_TILE_WIDTH, G.ORTHO_TILE_HEIGHT);
  const mx = x / G.ORTHO_TILE_WIDTH;
  const my = y / G.ORTHO_TILE_HEIGHT;
  if (round) return [Math.round(mx), Math.round(my)];
  return [mx, my];
};

export const orthoToIso = (x, y) => {
  const [mx, my] = orthoToMap(x, y);
  return mapToIso(mx, my);
};

export const isoToMap = (x, y, round = false) => {
  const mx =
    ((x - G.COORDS.SCREEN.nx(0)) / G.ISO_TILE_WIDTH_HALF +
      y / G.ISO_TILE_HEIGHT_HALF) /
    2;
  const my =
    (y / G.ISO_TILE_HEIGHT_HALF -
      (x - G.COORDS.SCREEN.nx(0)) / G.ISO_TILE_WIDTH_HALF) /
    2;
  if (round) return [Math.round(mx), Math.round(my)];
  return [mx, my];
};

export const isoToOrtho = (x, y) => {
  const [mx, my] = isoToMap(x, y);
  return mapToOrtho(mx, my);
};

export const pageToCanvas = (e) => {
  const { left, top } = G.DOM.CANVAS.getBoundingClientRect();
  const cx = (e.pageX - left) * G.DPR || 1;
  const cy = (e.pageY - top) * G.DPR || 1;
  return [cx, cy];
};
