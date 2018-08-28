import styled from 'react-emotion';
import { H1 as H1Core, H2 as H2Core, H3 as H3Core, H4 as H4Core } from 'uikit/Core';

export const H1 = styled(H1Core)`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
`;

export const H2 = styled(H2Core)``;

export const H3 = styled(H3Core)`
  font-weight: 500;
  font-size: 16px;
  line-height: 1.44;
  letter-spacing: 0.3px;
  color: ${({ theme }) => theme.secondary};
  letter-spacing: 0;
`;

export const H4 = styled(H4Core)``;
