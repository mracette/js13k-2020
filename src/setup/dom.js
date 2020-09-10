import { G } from '../globals';

export const cinematicResize = (
  elements,
  container,
  canvasSize,
  ratio = { x: 16, y: 9 }
) => {
  const { width, height } = container.getBoundingClientRect();
  const resizeRatio = Math.min(width / ratio.x, height / ratio.y);
  const w = ratio.x * resizeRatio - 2;
  const h = ratio.y * resizeRatio - 2;
  elements.forEach((el) => {
    const dpr = window.devicePixelRatio || 1;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    if (canvasSize) {
      el.width = w * dpr;
      el.height = h * dpr;
    }
  });
};

export const initDom = () => {
  const canvasElements = [G.DOM.CANVAS, G.DOM.POST_CANVAS, G.DOM.BLUR_CANVAS];
  cinematicResize(canvasElements, G.DOM.ROOT, true);
  window.addEventListener('resize', () =>
    cinematicResize(canvasElements, G.DOM.ROOT, false)
  );
};
