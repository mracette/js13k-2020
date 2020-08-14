import { G } from '../globals';
import { cinematicResize } from '../utils/screen';
import { setStyles } from '../utils/styles';

const initBody = () => {
  setStyles(G.DOM.BODY, [
    ['backgroundColor', G.COLORS.RAISIN_BLACK],
    ['position', 'absolute'],
    ['top', '0'],
    ['left', '0'],
    ['width', '100vw'],
    ['height', '100vh']
    // ['padding', '5vh 5vw']
  ]);
};

const initRoot = () => {
  setStyles(G.DOM.ROOT, [
    ['width', '100%'],
    ['height', '100%'],
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center']
  ]);
};

const initCanvas = () => {
  setStyles(G.DOM.CANVAS, [
    ['backgroundColor', G.COLORS.RAISIN_BLACK],
    ['border', `${G.BORDER_WIDTH}px solid ${G.COLORS.LIGHT_GRAY}`]
  ]);
  const resize = cinematicResize(G.DOM.CANVAS, G.DOM.ROOT);
  window.addEventListener('resize', resize);
  resize();
};

export const initDom = () => {
  initBody();
  initRoot();
  initCanvas();
};
