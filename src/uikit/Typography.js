import styled from 'react-emotion';
// import { Trans } from 'react-i18next'; TODO: add Trans by default
import {
  width,
  fontSize,
  fontFamily,
  textAlign,
  lineHeight,
  fontWeight,
  letterSpacing,
  space,
  color,
  borders,
  hover,
  complexStyle,
} from 'styled-system';

export const textStyles = complexStyle({
  prop: 'textStyle',
  key: 'textStyles',
});

const applyDefaultTypeStyles = Component => styled(Component)`
  ${({ theme }) => theme[Component]};
  ${space}
  ${width}
  ${fontSize}
  ${fontWeight}
  ${color}
  ${fontFamily}
  ${borders}
  ${letterSpacing}
  ${lineHeight}
  ${hover}
  ${textAlign}
  ${textStyles}
  ${({ css }) => css}
`;

export const P = applyDefaultTypeStyles('p');
export const Span = applyDefaultTypeStyles('span');
export const SmallText = applyDefaultTypeStyles('small');

export const H1 = applyDefaultTypeStyles('h1');

export const H2 = applyDefaultTypeStyles('h2');

export const H3 = applyDefaultTypeStyles('h3');

export const H4 = applyDefaultTypeStyles('h4');

export const H5 = applyDefaultTypeStyles('h4');
