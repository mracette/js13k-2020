import { G } from '../globals';

export const mapToScreen = (x, y) => {
  const sX =
    x * G.ISO_TILE_WIDTH_HALF -
    y * G.ISO_TILE_WIDTH_HALF +
    G.COORDS.SCREEN.nx(-0.5);
  const sY =
    x * G.ISO_TILE_HEIGHT_HALF +
    y * G.ISO_TILE_HEIGHT_HALF -
    G.COORDS.SCREEN.ny(-0.5);
  return [sX, sY];
};

export const screenToMap = (x, y) => {
  const mX = x / G.ORTHO_TILE_WIDTH + y / G.ISO_TILE_HEIGHT;
  const mY = y / G.ISO_TILE_HEIGHT - x / G.ISO_TILE_WIDTH;
  return [mX, mY];
};

export const orthoToMap = (x, y) => {
  return [x / G.ORTHO_TILE_WIDTH, y / G.ORTHO_TILE_HEIGHT];
};

export const orthoToIso = (x, y) => {
  const [mx, my] = orthoToMap(x, y);
  return mapToScreen(mx, my);
};
