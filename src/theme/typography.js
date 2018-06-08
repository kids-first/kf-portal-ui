import colors, { gradients } from './colors';
import { zipObject } from 'lodash';

export const fonts = {
  default: 'Montserrat, Helvetica, sans-serif',
  details: 'Open Sans',
};
const baseFontSize = 16;

// typographic scale
// px based
export const fontSizesScale = [12, 14, 16, 18, 20, 24, 30, 32, 36, 48, 64, 96, 128];
// keyed object to make sizes more declarative
// ex. fontSizes['32']
export const fontSizes = zipObject(fontSizesScale, fontSizesScale.map(v => v + 'px'));

// for any scale, either array or objects will work
// em based
export const lineHeightsScale = [0.95, 1, 1.125, 1.25, 1.44, 1.5, 1.86];
export const lineHeights = zipObject(lineHeightsScale, lineHeightsScale);

// based on imported fonts in index.css
export const fontWeights = {
  ultraThin: 100,
  thin: 300,
  regular: 400,
  normal: 500,
  bold: 700,
};

export const letterSpacings = {
  normal: 'normal',
  caps: '0.25em',
  heading: '0.5px',
};

const typographyBase = `text-decoration: none; border: none;`;

const headingsBase = `
  font-family: ${fonts.default};
  ${typographyBase}
`;

export const paragraph = `
  font-family: ${fonts.details};
  color: ${colors.greyScale1};
  font-size: ${baseFontSize}px;
  line-height: ${lineHeights['1.25']};
  ${typographyBase}
`;

export const headings = {
  h1: ` 
    ${headingsBase}
    font-size: ${fontSizes['36']};
    font-weight: ${fontWeights.normal};
    letter-spacing: ${letterSpacings.heading};
    background-image: ${gradients.blue};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;`,
  h2: `
    ${headingsBase}
    color: ${colors.secondary};
    font-size: ${fontSizes['30']};
    line-height: ${lineHeights['0.95']};
    letter-spacing: ${letterSpacings.heading};
    color: ${colors.secondary};
    font-weight: ${fontWeights.normal};
  `,
  h3: `
    ${headingsBase}
    font-weight: ${fontWeights.normal};
    font-size: ${fontSizes['18']};
    line-height: ${lineHeights['1.44']};
    letter-spacing: ${letterSpacings.heading};
    color: ${colors.secondary};
  `,
  h4: `
    ${headingsBase}
    font-family: ${fonts.details};
    font-size: ${fontSizes['16']};
    line-height: ${lineHeights['1.25']};
  `,
  h5: `
    ${headingsBase}
    ${paragraph}
    font-size: ${fontSizes['14']};
    font-weight: ${fontWeights.thin};
  `,
};

export const links = {
  internalLink: `
    color: #a42c90;
    font-weight: bold;
    &:hover {
      cursor: pointer;
      color: ${colors.hover};
    }
  `,
  externalLink: `
    color: ${colors.primary};
    cursor: pointer;
    &:hover,
    &.active {
      color: ${colors.highlight};
    }
  `,
};

export const text = {
  center: 'text-align: center;',
  left: 'text-align: left;',
  right: 'text-align: right;',
  underline: 'text-decoration: underline;',
  italic: 'font-style: italic;',
  captialize: 'text-transform: captialize;',
  small: 'font-size: 75%;',
};
