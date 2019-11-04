import React from 'react';
import { Link } from 'react-router-dom';

import Row from 'uikit/Row';
import Gravatar from 'uikit/Gravatar';
import { DropdownContainer, DropdownOptionsContainer } from 'uikit/Dropdown';
import { DropdownLabelContainer } from 'uikit/Dropdown/ui';
import { applyDefaultStyles } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';

import {
  navLink,
  linkButtonActive,
  linkAsButton,
  navBarList,
  navbarDropdownOptionsContainer,
  navbarDropdownWrapper,
  dropdownLink,
} from './Header.module.css';

export const NavLink = ({ children, className, to, currentPathName, ...props }) => {
  const classNames = `${className} ${navLink} color-primary ${
    currentPathName === to ? linkButtonActive : ''
  }`;
  return (
    <Link className={classNames} {...props}>
      {children}
    </Link>
  );
};

export const NavBarList = ({ children, justify = '' }) => (
  <ul className={navBarList} style={{ justifyContent: justify }}>
    {children}
  </ul>
);

export const LinkAsButton = ({ children, className, ...props }) => (
  <Link className={`${linkAsButton} ${className}`} {...props}>
    {children}
  </Link>
);

export const NavbarDropdownOptionsContainer = ({ children, ...props }) => (
  <DropdownOptionsContainer className={navbarDropdownOptionsContainer} {...props}>
    {children}
  </DropdownOptionsContainer>
);

export const NavbarKidsFirstDropdown = ({ children, ...props }) => (
  <NavbarDropdownOptionsContainer style={{ left: '-40px' }} {...props}>
    {children}
  </NavbarDropdownOptionsContainer>
);

export const NavbarDropdownWrapper = ({ children, ...props }) => (
  <DropdownContainer className={navbarDropdownWrapper} {...props}>
    {children}
  </DropdownContainer>
);

export const DropdownLink = ({ children, separated = false, ...props }) => (
  <Link className={`${dropdownLink} ${separated ? 'separated' : ''}`} {...props}>
    {children}
  </Link>
);

export const DropdownExternalLink = applyDefaultStyles(
  styled(ExternalLink)`
    color: ${({ theme }) => theme.greyScale2};
    text-decoration: none;
    padding: 10px 20px;
    border-top: ${({ theme, separated }) => (separated ? `1px solid ${theme.borderGrey}` : 'none')};
    border-left: solid 2px ${({ theme, borderColor }) => (borderColor ? borderColor : theme.white)};
    &:hover {
      color: ${({ theme }) => theme.hover};
      border-left: solid 2px ${({ theme }) => theme.hover};

      svg {
        fill: ${({ theme }) => theme.hover};
      }
    }
  `,
  {
    shouldForwardProp: prop => !['borderColor', 'separated'].includes(prop),
  },
);

export const HeaderContainer = styled('div')`
  background: ${({ theme }) => theme.white};
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.lighterShadow};
  flex: none;
  z-index: 2;
`;

export const GradientAccent = styled('div')`
  width: 100%;
  height: 5px;
  background-image: linear-gradient(to right, ${({ theme }) => theme.primaryGradient});
`;

export const HeaderContent = styled(Row)`
  padding: 10px;
  justify-content: space-between;
`;

export const Logo = styled('img')`
  width: 211px;
  height: 65px;
`;

export const NavigationGravatar = styled(Gravatar)`
  height: 45px;
  width: 45px;
  border-radius: 50%;
  padding: 2px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.borderGrey};
  margin: 5px;
`;

export const DropdownRow = applyDefaultStyles(styled(Row)``);

export const MenuLabelContainer = styled(DropdownLabelContainer)`
  color: ${({ theme, isOpen }) => (isOpen ? theme.hover : theme.primary)};
  svg {
    fill: ${({ theme, isOpen }) => (isOpen ? theme.hover : theme.primary)};
  }

  &:hover {
    color: ${({ theme }) => theme.hover};
    svg {
      fill: ${({ theme }) => theme.hover};
    }
  }
`;
