import { G } from '../globals';
import { CanvasCoordinates, clamp } from 'crco-utils';
import { MOUSE_HOVER_TILE } from '../state/screen';

export const cinematicResize = (element, container, ratio = G.RATIO) => {
  return () => {
    const { width, height } = container.getBoundingClientRect();
    const resizeRatio = Math.min(width / ratio.x, height / ratio.y);
    // subtract for border
    const w = ratio.x * resizeRatio - 2 * G.BORDER_WIDTH;
    const h = ratio.y * resizeRatio - 2 * G.BORDER_WIDTH;
    // even though dpr is in globals, it won't have been initialized yet
    // and must be calculated here
    const dpr = window.devicePixelRatio || 1;
    element.style.width = w + 'px';
    element.style.height = h + 'px';
    element.width = w * dpr;
    element.height = h * dpr;
  };
};

export const updateMouseHoverTile = (e) => {
  const { left, top, width, height } = G.DOM.CANVAS.getBoundingClientRect();
  const sx = width / 10;
  const sy = sx / 2;
  const ss = sy / 2;
  const mx = e.pageX - left - sy - width / 2;
  const my = e.pageY - top - sy - height / 2;
  console.log(mx, my);
  const tileX = Math.round(mx / sx - my / sy) + 4;
  const tileY = Math.round(my / sy + mx / sx) + 6;
  // const tileX = Math.round(pageX / w - pageY / h);
  // const tileY = Math.round(pageX / w + pageY / h);
  MOUSE_HOVER_TILE[0] = tileX;
  MOUSE_HOVER_TILE[1] = tileY;
};
