import { G } from '../globals';

export const setStyles = () => {
  G.CTX.strokeStyle = 'white';
  G.CTX.lineWidth = G.COORDS.SCREEN.getWidth() * 0.0005;
  G.CTX.fillStyle = 'black';
};
