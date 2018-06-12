import chroma from 'chroma-js';
import { baseFontSize } from '../src/theme/typography';

String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|[-](\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

export const css2js = css => {
  let frameCSS = css.replace(/([\w-.]+)\s*:([^;]+);?/g, '$1:$2,');
  frameCSS = frameCSS.replace(/,+$/, '');
  let properties = frameCSS.split(/(,$)/gm);
  let frameCSSObj = {};
  properties.forEach(function(property) {
    let cssProp = property.split(':');
    if (cssProp[1]) {
      let cssKey = cssProp[0].toCamelCase().trim();
      let cssValue = cssProp[1].trim();
      if (cssKey == 'fontWeight' && parseInt(cssValue) !== NaN) {
        cssValue = parseInt(cssValue) >= 300 ? 'bold' : 'regular';
      }
      if (cssValue.includes('px')) cssValue = +cssValue.replace('px', '');
      frameCSSObj[cssKey] = cssValue;
    }
  });

  return frameCSSObj;
};

const minimums = {
  aa: 4.5,
  aaLarge: 3,
  aaa: 7,
  aaaLarge: 4.5,
};

export const processColor = hex => {
  hex = chroma(hex).hex();
  const rgba = chroma(hex).rgba();
  const contrast = chroma.contrast(hex, 'white');
  return {
    hex,
    rgba,
    contrast,
    accessibility: {
      aa: contrast >= minimums.aa,
      aaLarge: contrast >= minimums.aaLarge,
      aaa: contrast >= minimums.aaa,
      aaaLarge: contrast >= minimums.aaaLarge,
    },
  };
};

export const EmToPx = emSize => Math.round(baseFontSize * emSize);
