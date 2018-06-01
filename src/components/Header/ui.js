import styled from 'react-emotion';
import { Link } from 'react-router-dom';
import Row from 'uikit/Row';
import Gravtar from 'uikit/Gravatar';
import { DropdownContainer } from 'uikit/Dropdown';

export const NavLink = styled(Link)`
  ${({ theme }) => theme.navLink};
  ${({ currentPathName, to, theme }) => (currentPathName === to ? theme.linkButtonActive : '')};
`;

export const NavBarList = styled('ul')`
  ${({ theme }) => theme.navBar};
  margin-left: ${({ ml }) => (ml ? `${ml}px` : 'none')};
  justify-content: ${({ justify }) => justify || ''};
`;

export const LinkAsButton = styled(Link)`
  ${({ theme }) => theme.linkAsButton};
  ${({ theme }) => theme.uppercase};
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
  &:hover {
    color: ${({ theme }) => theme.highlight};
  }
`;

export const HeaderContainer = styled('div')`
  background: ${({ theme }) => theme.white};
  box-shadow: 0 0 4.9px 0.1px ${({ theme }) => theme.shadow};
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
  width: 177px;
  height: 65px;
`;

export const NavigationGravatar = styled(Gravtar)`
  border-radius: 50%;
  padding: 2px;
  background-color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.borderGrey};
  margin: 5px;
`;
