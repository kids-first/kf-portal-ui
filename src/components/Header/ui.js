import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import { space } from 'styled-system';

import Row from 'uikit/Row';
import Gravtar from 'uikit/Gravatar';
import { DropdownContainer, DropdownOptionsContainer } from 'uikit/Dropdown';
import { DropdownLabelContainer } from 'uikit/Dropdown/ui';
import { applyDefaultStyles } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';

export const NavLink = styled(Link)`
  ${({ theme }) => theme.navLink};
  color: ${({ theme }) => theme.primary};
  ${({ currentPathName, to, theme }) => (currentPathName === to ? theme.linkButtonActive : '')};
`;

export const NavBarList = styled('ul')`
  ${({ theme }) => theme.navBar};
  ${space};
  justify-content: ${({ justify }) => justify || ''};
`;

export const LinkAsButton = styled(Link)`
  ${({ theme }) => theme.linkAsButton};
  ${({ theme }) => theme.uppercase};
`;

export const NavbarDropdownOptionsContainer = styled(DropdownOptionsContainer)`
  border-radius: 6px;
  padding-top: 8px;
  padding-bottom: 8px;
`;

export const NavbarKidsFirstDropdown = styled(NavbarDropdownOptionsContainer)`
  left: -40px;
`;

export const NavbarDropdownWrapper = styled(DropdownContainer)`
  border: 0;
  color: ${({ theme }) => theme.hover};

  font-size: 14px;
  font-weight: 500;
  line-height: 1.86;
  letter-spacing: 0.2px;

  line-height: 1.86;
  letter-spacing: 0.2px;
  padding-right: 10px;
`;

export const DropdownLink = styled(Link)`
  color: ${({ theme }) => theme.greyScale2};
  text-decoration: none;
  padding: 10px 20px;
  border-top: ${({ theme, separated }) => (separated ? `1px solid ${theme.borderGrey}` : 'none')};
  border-left: solid 2px ${({ theme }) => theme.white};
  &:hover {
    color: ${({ theme }) => theme.hover};
    border-left: solid 2px ${({ theme }) => theme.hover};

    svg {
      fill: ${({ theme }) => theme.hover};
    }
  }
`;

export const DropdownExternalLink = applyDefaultStyles(styled(ExternalLink)`
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
`);

export const HeaderContainer = styled('div')`
  background: ${({ theme }) => theme.white};
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.lighterShadow};
  flex: none;
  z-index: 1;
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

export const NavigationGravatar = styled(Gravtar)`
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
