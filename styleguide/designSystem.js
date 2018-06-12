import { pick, mapValues } from 'lodash';
import { css2js, processColor, EmToPx } from './utils';
import colors from '../src/theme/colors';
import { headings, paragraph, fonts, links } from '../src/theme/typography';

// chain typography transformation together using lodash
const headers = mapValues(headings, val => css2js(val));
const typography = mapValues(headers, val =>
  pick(val, ['fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'color']),
);
mapValues(typography, val => {
  if (val.lineHeight && !val.lineHeight.includes('px')) {
    val.lineHeight = EmToPx(parseFloat(val.lineHeight));
  }
  return val;
});
typography['Body Copy'] = css2js(paragraph);
typography['Body Copy'].lineHeight = EmToPx(typography['Body Copy'].lineHeight);

export default {
  fonts,
  typography,
  links: mapValues(links, val => css2js(val)),
  colors: Object.keys(colors).reduce(
    (acc, name) => ({
      ...acc,
      [name]: processColor(colors[name]),
    }),
    {},
  ),
};
