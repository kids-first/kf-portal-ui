import styled from 'react-emotion';
import {
  fontSize,
  fontFamily,
  textAlign,
  lineHeight,
  fontWeight,
  letterSpacing,
  space,
  color,
  borders,
} from 'styled-system';

export const H1 = styled('h1')`
  ${({ theme }) => theme.h1};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export const H2 = styled('h2')`
  ${({ theme }) => theme.h2};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export const H3 = styled('h3')`
  ${({ theme }) => theme.h3};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export const H4 = styled('h4')`
  ${({ theme }) => theme.h4};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export const H5 = styled('h5')`
  ${({ theme }) => theme.h5};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export const P = styled('p')`
  ${({ theme }) => theme.paragraph};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export const SmallText = styled('small')`
  ${({ theme }) => theme.text.small};
  ${fontSize}
  ${fontFamily}
  ${textAlign}
  ${lineHeight}
  ${fontWeight}
  ${letterSpacing}
  ${space}
  ${color}
  ${borders}
  ${({ css }) => css}
`;

export default {
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  SmallText,
};
