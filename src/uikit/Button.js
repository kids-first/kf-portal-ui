import React from 'react';
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

export const HollowButton = styled(Button)`
  ${({ theme }) => theme.hollowButton};
`;

const BigWhiteButtonContent = styled('span')`
  ${({ theme }) => theme.row};
`;
const BigWhiteButtonBase = ({ children, ...x }) => (
  <Button {...x}>
    <BigWhiteButtonContent>{children}</BigWhiteButtonContent>
  </Button>
);
export const BigWhiteButton = styled(BigWhiteButtonBase)`
  background: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.greyScale8};
  box-shadow: 0 0 1px 0.1px ${({ theme }) => theme.lightShadow};
  border-radius: 25px;
  height: auto;
  padding-top: 0px;
  padding-bottom: 0px;
`;

export default Button;
