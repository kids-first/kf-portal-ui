import styled from 'react-emotion';

export const H1 = styled('h1')`
  ${({ theme }) => theme.h1};
`;

export const H2 = styled('h2')`
  ${({ theme }) => theme.h2};
`;

export const H3 = styled('h3')`
  ${({ theme }) => theme.h3};
`;

export const H4 = styled('h4')`
  ${({ theme }) => theme.h4};
`;

export const H5 = styled('h5')`
  ${({ theme }) => theme.h5};
`;

export const P = styled('p')`
  ${({ theme }) => theme.paragraph};
`;

export const SmallText = styled('small')`
  ${({ theme }) => theme.text.small};
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
