import React from 'react';
import styled from 'react-emotion';

import Row from 'uikit/Row';

const Dots = styled(Row)`
  justify-content: center;
`;

const IndexCircle = styled('div')`
  border-radius: 50%;
  height: 11px;
  width: 11px;
  background-color: ${props => (props.active ? '#cc3399' : '#a6278f')};
  margin-left: 6px;
`;

const IndexDots = ({ index, items }) => {
  const dots = [];
  if (items <= 1) return null;
  for (let i = 0; i < items; i++) {
    dots.push(<IndexCircle key={i} active={i === index} />);
  }
  return <Dots>{dots}</Dots>;
};

export default IndexDots;
