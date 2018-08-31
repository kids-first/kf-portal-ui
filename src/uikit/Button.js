import React from 'react';
import styled from 'react-emotion';
import { applyDefaultStyles } from './Core';

const BaseButton = styled('button')`
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
`;

const Button = applyDefaultStyles(styled(BaseButton)`
  height: 30px;
  border-radius: 14px;
  background-color: ${({ disabled }) => (disabled ? '#c5dee3' : '#009bb8')};
  color: #fff;
`);

export const LightButton = styled(BaseButton)`
  ${({ theme }) => theme.hollowButton};
  ${({ theme }) => theme.row};
  ${({ theme }) => theme.center};
  font-weight: bold;
`;

export const ActionButton = styled(Button)`
  ${({ theme }) => theme.actionButton};
`;

export const HollowButton = applyDefaultStyles(styled(Button)`
  ${({ theme }) => theme.hollowButton};
`);

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
  border-radius: 25px;
  height: auto;
  padding-top: 0px;
  padding-bottom: 0px;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`;

export default Button;

export const WhiteButton = styled('button')`
  border: 1px solid ${({ theme }) => theme.borderGrey};
  color: #000;
  font-family: ${({ theme }) => theme.fonts.default};
  text-transform: uppercase;
  font-weight: 500;
  background-color: ${({ theme }) => theme.white};
  font-size: 12px;
  border-radius: 15px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.tertiary};
    color: ${({ theme }) => theme.white};
  }
`;
