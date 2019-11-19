import React from 'react';
import styled from 'react-emotion';
import Row from 'uikit/Row';
import Component from 'react-component-component';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';

const Link = styled(Row)`
  padding-bottom: 5px;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  color: ${({ active, theme }) => (active ? theme.linkPurple : theme.purple)};
  border-bottom: ${({ active, theme }) => `2px solid ${active ? theme.linkPurple : 'transparent'}`};
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.linkPurple};
  }
`;

const ViewLink = ({ children, Icon, onClick, active, theme }) => (
  <Component initialState={{ isHovered: false }}>
    {({ state, setState }) => (
      <Link
        active={active}
        isHovered={state.isHovered}
        onClick={onClick}
        onMouseEnter={() => setState({ isHovered: true })}
        onMouseLeave={() => setState({ isHovered: false })}
      >
        <Icon
          style={{ marginRight: '5px' }}
          fill={active || state.isHovered ? theme.linkPurple : theme.purple}
        />
        {children}
      </Link>
    )}
  </Component>
);

export default compose(withTheme)(ViewLink);
