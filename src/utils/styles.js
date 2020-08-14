export const setStyles = (element, styles) => {
  styles.forEach((style) => {
    const [name, value] = style;
    element.style[name] = [value];
  });
};
