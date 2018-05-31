import styled from 'react-emotion';
import { LightButton } from 'uikit/Button';
import Row from 'uikit/Row';

export const ButtonContainer = styled(Row)`
  ${({ theme }) => theme.center};
  padding: 10px;
`;

export const CustomLightButotn = styled(LightButton)`
  min-width: 65px;
`;
