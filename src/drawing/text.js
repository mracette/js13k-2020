import { G } from '../globals';

export const drawText = (text, x, y, align = 'center', baseline = 'middle') => {
  G.CTX.textAlign = align;
  G.CTX.textBaseline = baseline;
  G.CTX.textBaseline = baseline;
  G.CTX.fillStyle = 'white';
  G.CTX.font = `${G.COORDS.SCREEN.getWidth() * 0.007}px sans-serif`;
  G.CTX.fillText(text, x, y);
};
