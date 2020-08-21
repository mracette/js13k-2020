import { G } from '../globals';
import { Vector3 } from '../core/Vector3';

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

export const renderTileCoords = (tileGroup) => {
  G.CTX.textAlign = 'center';
  G.CTX.textBaseline = 'middle';
  G.CTX.fillStyle = 'white';
  G.CTX.font = `${G.COORDS.getWidth() * 0.007}px sans-serif`;
  tileGroup.children.forEach((tile) => {
    const position = new Vector3(
      tile.position.x + 0.5,
      tile.position.y + 0.5,
      0
    );
    G.CAMERA.project(position, true, G.CTX);
    const text = `${tile.position.x}, ${tile.position.y}`;
    G.CTX.fillText(text, position.x, position.y);
  });
};
