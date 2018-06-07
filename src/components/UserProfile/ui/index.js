import React from 'react';
import { compose } from 'recompose';
import styled from 'react-emotion';
import PencilIcon from 'react-icons/lib/fa/pencil';
import { withTheme } from 'emotion-theming';

import { Flex } from 'uikit/Core';

export const Container = styled(Flex)`
  height: 100%;
  width: 76%;
`;

export const EditButton = compose(withTheme)(({ theme, ...props }) => (
  <button css={theme.hollowButton} {...props}>
    <PencilIcon className={'icon'} /> Edit
  </button>
));

export const H2 = styled('h2')`
  ${props => props.theme.profileH2};
`;

export const H3 = styled('h3')`
  ${props => props.theme.profileH3};
`;

export const H4 = styled('h4')`
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 13px;
  font-style: italic;
  line-height: 1.85;
  text-align: left;
  color: #74757d;
  margin: 0;
  font-weight: normal;
`;

export const NavContainer = styled('div')`
  border-radius: 5px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 0 2.9px 0.1px ${({ theme }) => theme.lightShadow};
  padding: 1em;
`;

export const NavList = styled('ul')`
  ${({ theme }) => theme.column} list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 2.86;
  letter-spacing: 0.2px;
  text-align: left;
`;

const NavLinkBase = ({ active, children, className, ...x }) => (
  <a className={`${active ? `active` : ``} ${className}`}>{children}</a>
);
const NavLink = styled(NavLinkBase)`
  display: block;
  font-size: 14px;
  line-height: 1.86;
  letter-spacing: 0.2px;
  text-align: left;
  color: ${({ theme }) => theme.active};
  font-weight: 500;
  padding: 0 10px;
  border-left: 3px solid transparent;
  margin: 0.25em 1em 0.25em 0;

  &:hover,
  &.active {
    cursor: pointer;
    color: ${({ theme }) => theme.highlight};
    font-weight: 500;
    border-left: 3px solid ${({ theme }) => theme.highlight};
  }
`;
export const NavItem = x => (
  <li>
    <NavLink {...x} />
  </li>
);
