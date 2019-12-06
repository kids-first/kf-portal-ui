import React from 'react';

import {
  actionButton,
  baseButton,
  bigWhiteButton,
  baseButtonWithIcon,
  disabledButtonStyles,
  whiteButton,
  tealActionButton,
  largeTealActionButton,
} from './Button.module.css';
import { flexRow } from '../../src/theme/tempTheme.module.css';
export { disabledButtonStyles };

const Button = ({ children, className = '', ...props }) => (
  <button className={`${baseButton} ${className}`} {...props}>
    {children}
  </button>
);
export default Button;

export const ActionButton = ({ children, className = '', ...props }) => (
  <Button className={`${actionButton} ${className}`} {...props}>
    {children}
  </Button>
);

export const BigWhiteButton = ({ children, className = '', ...props }) => (
  <Button {...props}>
    <span className={`${flexRow} ${bigWhiteButton} ${className}`}>{children}</span>
  </Button>
);

export const WhiteButton = ({ children, className = '', ...props }) => (
  <button
    className={`${baseButtonWithIcon} ${disabledButtonStyles} ${whiteButton} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const TealActionButton = ({ children, className = '', ...props }) => (
  <button
    className={`${baseButtonWithIcon} ${disabledButtonStyles} ${tealActionButton} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const LargeTealActionButton = ({ children, ...props }) => (
  <TealActionButton className={largeTealActionButton} {...props}>
    {children}
  </TealActionButton>
);
