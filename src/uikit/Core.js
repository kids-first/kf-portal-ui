import { Link as LinkBase } from 'react-router-dom';
import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  color,
  lineHeight,
  fontWeight,
  borders,
  borderRadius,
  alignItems,
  justifyContent,
  flexGrow,
  flexWrap,
  flexBasis,
  flexDirection,
  justifySelf,
  alignSelf,
  maxWidth,
  complexStyle,
  hover,
} from 'styled-system';

const applyProp = (name, value) => (value ? `${name}: ${value};` : ``);
const overflow = ({ overflow }) => applyProp(`overflow`, overflow);
const overflowY = ({ overflowY, a = console.log('1111', overflowY) }) =>
  applyProp(`overflow-y`, overflowY);

const applyDefaultStyles = Component => styled(Component)`
  ${space}
  ${width}
  ${fontSize}
  ${fontWeight}
  ${color}
  ${maxWidth}
  ${justifySelf}
  ${alignSelf}
  ${boxStyles}
  ${borders}
  ${borderRadius}
  ${lineHeight}
  ${overflow}
  ${overflowY}
  ${hover}
`;

const boxStyles = complexStyle({
  prop: 'boxStyle',
  key: 'boxStyles',
});
export const Box = applyDefaultStyles('div');

const flexStyles = complexStyle({
  prop: 'flexStyle',
  key: 'flexStyles',
});
export const Flex = styled(Box)`
  display: flex;
  ${flexStyles};
  ${alignItems};
  ${justifyContent};
  ${flexWrap};
  ${flexBasis};
  ${flexDirection};
  ${flexGrow};
`;

export const Link = applyDefaultStyles(LinkBase);

export const Section = styled(applyDefaultStyles('section'))`
  ${({ theme }) => theme.section};
`;

export const Span = applyDefaultStyles('span');

export const H1 = applyDefaultStyles('h1');

export const H2 = applyDefaultStyles('h2');

export const H3 = applyDefaultStyles('h3');

export const H4 = applyDefaultStyles('h4');
