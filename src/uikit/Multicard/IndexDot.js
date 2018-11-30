import React from 'react';
import styled from 'react-emotion';

const IndexCircle = styled('div')`
  border-radius: 50%;
  height: 11px;
  width: 11px;
  background-color: ${props => (props.active ? '#a6278f' : '#cc3399')};
  margin-left: 6px;

  &:hover {
    cursor: pointer;
  }
`;

const IndexDot = ({ active }) => <IndexCircle active={active} />;

export default IndexDot;
