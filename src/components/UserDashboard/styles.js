import styled from 'react-emotion';

import { Flex, H2 as H2Core, H3 as H3Core, H4 as H4Core } from 'uikit/Core';
import Row from 'uikit/Row';

export const H3 = styled(H3Core)`
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};

  margin: 0;
`;

export const H2 = styled(H2Core)`
  font-size: 28px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0px;
`;

export const H4 = styled(H4Core)`
  font-size: 18px;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ theme }) => theme.primaryHover};
  margin: 0 0 5px 0;
`;

export const IntegrationsDiv = styled(Row)`
  justify-content: space-around;
  align-items: center;
`;

export const IntegrationsCircleDiv = styled(Flex)`
  width: 82px;
  height: 82px;
  flex: none;
  border-radius: 100%;
  background: ${({ theme }) => theme.white};
  justify-content: center;
  border: solid 1px ${({ theme }) => theme.greyScale5};
`;
