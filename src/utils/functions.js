import { G } from '../globals';

export const RAND = () => Math.random();
export const F32 = (n) => new Float32Array(n);
export const getElement = (id) => document.getElementById(id);
export const delay = (t, v) => {
  return new Promise(function (resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
};
export const dialogue = (text, time) => {
  G.DOM.DIALOGUE = text;
  delay(time);
  G.DOM.DIALOGUE = text;
};
