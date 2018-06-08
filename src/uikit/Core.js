import styled from 'react-emotion';
import {
  space,
  width,
  fontSize,
  color,
  borders,
  borderRadius,
  alignItems,
  justifyContent,
  flexWrap,
  flexBasis,
  flexDirection,
  justifySelf,
  alignSelf,
  maxWidth,
  complexStyle,
} from 'styled-system';

const boxStyles = complexStyle({
  prop: 'boxStyle',
  key: 'boxStyles',
});
export const Box = styled('div')`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${maxWidth}
  ${justifySelf}
  ${alignSelf}
  ${boxStyles}
  ${borders}
  ${borderRadius}
`;

export const Flex = styled(Box)`
  display: flex;
  ${({ row, theme }) => (row ? theme.row : '')}
  ${({ column, theme }) => (column ? theme.column : '')}
  ${({ center, theme }) => (center ? theme.center : '')}
  ${alignItems};
  ${justifyContent};
  ${flexWrap};
  ${flexBasis};
  ${flexDirection};
`;

export const Section = styled('section')`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${maxWidth}
  ${boxStyles}
  ${({ theme }) => theme.section}
`;
