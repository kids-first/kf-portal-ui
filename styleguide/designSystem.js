import { pick, mapValues } from 'lodash';
import { css2js, processColor, EmToPx } from './utils';
import colors from '../src/theme/colors';
import { headings, paragraph, fonts, baseFontSize } from '../src/theme/typography';

// chain typography transformation together using lodash
const headers = mapValues(headings, val => css2js(val));
const typography = mapValues(headers, val =>
  pick(val, ['fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'color']),
);
mapValues(typography, val => {
  if (val.lineHeight && !val.lineHeight.includes('px')) {
    val.lineHeight = EmToPx(baseFontSize, parseInt(val.lineHeight)) + 'px';
  }
  return val;
});
typography['Body Copy'] = css2js(paragraph);
typography['Body Copy'].lineHeight = EmToPx(baseFontSize, typography['Body Copy'].lineHeight);

export default {
  fonts,
  typography,
  colors: Object.keys(colors).reduce(
    (acc, name) => ({
      ...acc,
      [name]: processColor(colors[name]),
    }),
    {},
  ),
};
