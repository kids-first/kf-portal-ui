import colors from './colors';

export const fonts = {
  default: 'Montserrat, Helvetica, sans-serif',
  details: 'Open Sans',
};

export const fontSizes = [12, 14, 16, ];

const typogrpahyBase = ` text-decoration: none; border: none;`;

const headingsBase = `
  font-family: ${fonts.default};
  ${typogrpahyBase}
`;

export const paragraph = `
  font-family: ${fonts.details};
  color: ${colors.greyScale1};
  font-size: 14px;
  line-height: 1.86;
  ${typogrpahyBase}
`;

export const headings = {
  h1: ` 
    ${headingsBase}
    background-image: linear-gradient(to right, #404c9a, #009bb8 51%, #02b0ed),linear-gradient(#2b388f, #2b388f);
    font-size: 36px;
    font-weight: 500;
    margin: 10px 0;
    letter-spacing: 0.5px;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;`,
  h2: `
    ${headingsBase}
    color: ${colors.secondary};
    font-size: 30px;
    line-height: 0.87;
    letter-spacing: 0.4px;
    color: #2b388f;
    font-weight: 500;
  `,
  h3: `
    ${headingsBase}
    font-weight: 500;
    font-size: 18px;
    line-height: 1.44;
    letter-spacing: 0.3px;
    color: ${colors.secondary};
  `,
  h4: `
    ${headingsBase}
    font-family: ${fonts.details};
    font-size: 16px;
    line-height: 31px;
  `,
  h5: `
    ${headingsBase}
    ${paragraph}
    font-size: 14px;
    font-weight: 100;
  `
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
