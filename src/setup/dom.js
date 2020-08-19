import { G } from '../globals';
import { cinematicResize } from '../utils/screen';
import { setDomStyles } from '../utils/styles';

const initBody = () => {
  setDomStyles(G.DOM.BODY, [
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
  setDomStyles(G.DOM.ROOT, [
    ['width', '100%'],
    ['height', '100%'],
    ['display', 'flex'],
    ['justifyContent', 'center'],
    ['alignItems', 'center']
  ]);
};

const initCanvas = () => {
  setDomStyles(G.DOM.CANVAS, [
    ['border', `${G.BORDER_WIDTH}px solid ${G.COLORS.LIGHT_GRAY}`],
    ['position', 'absolute']
  ]);
  setDomStyles(G.DOM.TILE_CANVAS, ['position', 'absolute']);
  const mainResize = cinematicResize(G.DOM.CANVAS, G.DOM.ROOT);
  const tileResize = cinematicResize(G.DOM.TILE_CANVAS, G.DOM.ROOT);
  const resizeAll = () => {
    mainResize();
    tileResize();
  };
  window.addEventListener('resize', resizeAll);
  resizeAll();
};

export const initDom = () => {
  initBody();
  initRoot();
  initCanvas();
};
