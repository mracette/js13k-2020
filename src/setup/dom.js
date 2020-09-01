import { G } from '../globals';

export const setDomStyles = (elements, styles) => {
  elements.forEach((el) => {
    styles.forEach((style) => {
      const [name, value] = style;
      el.style[name] = [value];
      console.log(el, el.style);
    });
  });
};

export const cinematicResize = (
  elements,
  container,
  ratio = { x: 2, y: 1 }
) => {
  const { width, height } = container.getBoundingClientRect();
  const resizeRatio = Math.min(width / ratio.x, height / ratio.y);
  const w = ratio.x * resizeRatio - 2;
  const h = ratio.y * resizeRatio - 2;
  elements.forEach((el) => {
    const dpr = window.devicePixelRatio || 1;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.width = w * dpr;
    el.height = h * dpr;
  });
};

const initBody = () => {
  setDomStyles(
    [G.DOM.BODY],
    [
      // ['backgroundColor', colors.RAISIN_BLACK],
      ['position', 'absolute'],
      ['top', '0'],
      ['left', '0'],
      ['width', '100vw'],
      ['height', '100vh']
      // ['padding', '5vh 5vw']
    ]
  );
};

const initRoot = () => {
  setDomStyles(
    [G.DOM.ROOT],
    [
      ['width', '100%'],
      ['height', '100%'],
      ['display', 'flex'],
      ['justifyContent', 'center'],
      ['alignItems', 'center']
    ]
  );
};

const initCanvas = () => {
  const canvasElements = [
    G.DOM.CANVAS,
    G.DOM.POST_CANVAS,
    G.DOM.TILE_CANVAS,
    G.DOM.WEBGL_CANVAS
  ];
  const canvasStyles = [['position', 'absolute']];
  setDomStyles(canvasElements, canvasStyles);
  cinematicResize(canvasElements, G.DOM.ROOT);
};

export const initDom = () => {
  initBody();
  initRoot();
  initCanvas();
};
