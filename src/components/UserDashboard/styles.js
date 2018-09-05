import styled from 'react-emotion';

import { Flex, H3 as H3Core } from 'uikit/Core';
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
