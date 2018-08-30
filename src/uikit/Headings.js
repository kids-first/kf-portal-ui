import styled, { css } from 'react-emotion';
import { applyDefaultStyles } from 'uikit/Core';

const BaseHeading = ({ theme }) => css`
  color: ${theme.secondary};
  margin: 0;
  padding: 0;
  font-weight: 500;
  line-height: 0.71;
  letter-spacing: 0.4px;
  font-family: ${theme.fonts.default};
`;

export const H1 = applyDefaultStyles(styled('h1')`
  ${BaseHeading};
  font-size: 28px;
`);

export const H2 = applyDefaultStyles(styled('h2')`
  font-weight: 500;
  margin: 0;

  color: ${({ theme }) => theme.secondary};
  margin: 0;
  font-size: 22px;
`);

export const H3 = applyDefaultStyles(styled('h3')`
  font-weight: 500;
  margin: 0;
  font-size: 16px;
  line-height: 1.44;
  letter-spacing: 0.3px;
`);

export const H4 = styled('h4')`
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.secondary};
`;
