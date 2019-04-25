import React from 'react';
import styled from 'react-emotion';

const Header = styled('div')`
  margin-left: 26px;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 12px;
  color: ${props => (props.active ? '#cc3399' : '#a6278f')};
  border-bottom: ${props => (props.active ? '2px solid #cc3399' : '')};
  padding-bottom: 2px;
  &:hover {
    cursor: pointer;
  }
`;

const DualPaneHeader = ({ title, onClick, active }) => (
  <Header onClick={onClick} active={active}>
    {title}
  </Header>
);
export default DualPaneHeader;
