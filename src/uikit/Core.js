import { Link as LinkBase } from 'react-router-dom';
import styled from 'react-emotion';
import {
  space,
  width,
  height,
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
  textAlign,
  position,
  left,
  right,
  display,
} from 'styled-system';

const applyProp = (name, value) => (value ? `${name}: ${value};` : ``);
const overflow = ({ overflow }) => applyProp(`overflow`, overflow);
const overflowY = ({ overflowY }) => applyProp(`overflow-y`, overflowY);

const baseStyles = complexStyle({
  prop: 'baseStyle',
  key: 'baseStyles',
});
export const applyDefaultStyles = (
  Component,
  customShouldFowardProp = { shouldForwardProp: null },
) => styled(Component, {
  shouldForwardProp: customShouldFowardProp.shouldForwardProp,
})`
  ${baseStyles}
  ${space}
  ${width}
  ${height}
  ${fontSize}
  ${fontWeight}
  ${color}
  ${maxWidth}
  ${justifySelf}
  ${alignSelf}
  ${borders}
  ${borderRadius}
  ${lineHeight}
  ${overflow}
  ${overflowY}
  ${hover}
  ${textAlign}
  ${position}
  ${left}
  ${right}
  ${display}
`;

const boxStyles = complexStyle({
  prop: 'boxStyle',
  key: 'boxStyles',
});
export const Box = styled(applyDefaultStyles('div'))`
  ${boxStyles};
`;

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

const linkStyles = complexStyle({
  prop: 'linkStyle',
  key: 'linkStyles',
});
export const Link = styled(applyDefaultStyles(LinkBase))`
  ${linkStyles};
  &:hover {
    color: ${({ theme }) => theme.highlight};
  }
`;
export const ExternalLink = styled(applyDefaultStyles('a'))`
  ${linkStyles};
  &:hover {
    color: ${({ theme }) => theme.highlight};
  }
`;

export const Section = applyDefaultStyles(styled('section')`
  font-family: ${({ theme }) => theme.fonts.details};
  color: ${({ theme }) => theme.greyScale1};
  font-size: 14px;
  line-height: 2.57;
  letter-spacing: 0.2px;
`);

export const Span = applyDefaultStyles(styled('span')`
  font-family: ${({ theme }) => theme.fonts.details};
`);

export const Div = applyDefaultStyles(styled('div')`
  font-family: ${({ theme }) => theme.fonts.details};
`);

export const Paragraph = applyDefaultStyles(styled('p')`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.details};
  line-height: 28px;
  font-size: 15px;
  color: ${({ theme }) => theme.greyScale1};
`);

export const H1 = applyDefaultStyles('h1');

export const H2 = applyDefaultStyles('h2');

export const H3 = applyDefaultStyles('h3');

export const H4 = applyDefaultStyles('h4');
