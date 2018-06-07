import styled from 'react-emotion';

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
  ${({ theme }) => theme.hollowButton};
  ${({ theme }) => theme.row};
  ${({ theme }) => theme.center};
  font-weight: bold;
`;

export const ActionButton = styled(Button)`
  ${({ theme }) => theme.actionButton};
`;

export default Button;
