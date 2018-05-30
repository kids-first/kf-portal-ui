import styled from 'react-emotion';
import { css } from 'emotion';

const BaseButton = styled('button')`
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

const Button = styled(BaseButton)`
  height: 30px;
  border-radius: 14px;
  background-color: ${({ disabled }) => (disabled ? '#c5dee3' : '#009bb8')};
  color: #fff;
`;

export const LightButton = styled(BaseButton)`
  height: 22px;
  border-radius: 10.5px;
  background-color: #fff;
  color: #008199;
`;

export const ActionButton = styled(Button)`
  ${theme =>
    css`
      ${theme.actionButton};
    `};
  padding-left: 20px;
  padding-right: 20px;
  text-transform: uppercase;
`;

export default Button;
