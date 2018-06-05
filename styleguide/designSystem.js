import {pick, mapValues} from 'lodash';
import {css2js, processColor} from './utils';
import colors from '../src/theme/colors';
import {headings, paragraph, fonts} from '../src/theme/typography';

const headers = mapValues(headings, val => css2js(val))
const typography = mapValues(headers, val => pick(val, ['fontSize', 'fontFamily','fontWeight','lineHeight', 'color']));
typography['Body Copy'] = css2js(paragraph);

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
