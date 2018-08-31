import styled from 'react-emotion';
import { LightButton } from 'uikit/Button';
import Row from 'uikit/Row';

export const ButtonContainer = styled(Row)`
  ${({ theme }) => theme.center};
  padding: 10px 5px;
`;

export const CustomLightButton = styled(LightButton)`
  min-width: 75px;
  font-size: 10px;
`;
