import { G } from '../globals';
import * as colors from '../entities/styles';
import { cinematicResize } from '../utils/screen';
import { setDomStyles } from '../utils/styles';

const initBody = () => {
  setDomStyles(G.DOM.BODY, [
    ['backgroundColor', colors.RAISIN_BLACK],
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
    ['border', `${G.BORDER_WIDTH}px solid ${colors.LIGHT_GRAY}`],
    ['position', 'absolute']
  ]);
  setDomStyles(G.DOM.POST_CANVAS, ['position', 'absolute']);
  setDomStyles(G.DOM.TILE_CANVAS, ['position', 'absolute']);
  const mainResize = cinematicResize(G.DOM.CANVAS, G.DOM.ROOT);
  const tileResize = cinematicResize(G.DOM.TILE_CANVAS, G.DOM.ROOT);
  const postResize = cinematicResize(G.DOM.POST_CANVAS, G.DOM.ROOT);
  const resizeAll = () => {
    mainResize();
    tileResize();
    postResize();
  };
  // window.addEventListener('resize', resizeAll);
  resizeAll();
};

export const initDom = () => {
  initBody();
  initRoot();
  initCanvas();
};
