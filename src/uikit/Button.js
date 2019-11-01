import React from 'react';
import styled, { css } from 'react-emotion';
import { applyDefaultStyles } from './Core';

import { actionButton } from './Button.module.css';
import { flexRow } from 'src/theme/tempTheme.module.css';

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

export const ActionButton = ({ className, children, ...props }) => (
  <Button className={`${actionButton} ${className}`} {...props}>
    {children}
  </Button>
);

const BigWhiteButtonContent = styled('span')`
  ${flexRow};
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
`;

export default Button;

const BaseButtonWithIcon = ({ theme, disabled }) => css`
  color: ${theme.white};
  text-align: center;
  cursor: ${disabled ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 12px;
  font-family: ${theme.fonts.default};
  letter-spacing: 0.2px;
  padding: 8px 10px;
  border-radius: 15px;
  box-shadow: none;
`;

export const disabledButtonStyles = ({ theme }) => css`
  background-color: ${theme.backgroundGrey};
  color: ${theme.borderGrey};
  &:hover:disabled {
    background-color: ${theme.backgroundGrey};
  }
  cursor: not-allowed;
`;

export const WhiteButton = applyDefaultStyles(styled('button')`
  ${BaseButtonWithIcon};
  border: 1px solid ${({ theme }) => theme.borderGrey};
  color: ${({ theme }) => theme.lightBlue};
  background-color: ${({ theme }) => theme.white};

  & a {
    text-decoration: none;
    color: ${({ theme }) => theme.lightBlue};
  }

  & .icon {
    margin-right: 5px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.tertiary};
    color: ${({ theme }) => theme.white};

    .icon {
      background-color: ${({ theme }) => theme.tertiary};
      color: ${({ theme }) => theme.white};
    }

    a {
      color: ${({ theme }) => theme.white};
    }
  }
  &:disabled {
    ${disabledButtonStyles}
  }
`);

export const TealActionButton = applyDefaultStyles(styled('button')`
  ${BaseButtonWithIcon};
  border: 1px solid ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.tertiary)};
  background-color: ${({ theme, disabled }) => (disabled ? theme.greyScale8 : theme.tertiary)};
  color: ${({ theme, disabled }) => (disabled ? theme.greyDisabled : theme.white)};

  &:hover {
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.greyScale8 : theme.tertiaryHover};
  }

  & a {
    text-decoration: none;
    color: ${({ theme }) => theme.white};
  }
`);

export const LargeTealActionButton = styled(TealActionButton)`
  padding: 13px 25px;
  font-size: 14px;
  border-radius: 18px;
`;
