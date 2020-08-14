import { G } from '../globals';

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
