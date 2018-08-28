import styled from 'react-emotion';
import { applyDefaultStyles } from 'uikit/Core';

const BaseHeading = `
  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
`;

export const H1 = applyDefaultStyles(styled('h1')`
  ${BaseHeading};
  font-size: 28px;
`);

export const H2 = applyDefaultStyles(styled('h2')`
  ${BaseHeading};
  font-size: 22px;
`);

export const H3 = applyDefaultStyles(styled('h3')`
  ${BaseHeading};
  font-size: 16px;
  line-height: 1.44;
  letter-spacing: 0.3px;
  letter-spacing: 0;
`);

export const H4 = styled('h4')``;
