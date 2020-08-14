// starts at "top left"
export const box = (x, y, h, w) => {
  return [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h]
  ];
};
