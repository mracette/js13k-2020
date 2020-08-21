import { G } from '../globals';

export const pageToCanvas = (e) => {
  const { left, top } = G.DOM.CANVAS.getBoundingClientRect();
  const cx = (e.pageX - left) * G.DPR || 1;
  const cy = (e.pageY - top) * G.DPR || 1;
  return [cx, cy];
};
