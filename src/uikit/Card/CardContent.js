import React from 'react';
import styled from 'react-emotion';

const Content = styled('div')`
  height: 100%;
  overflow-y: ${props => (props.scrollable ? 'auto' : 'visible')};
`;

const CardContent = ({ children, scrollable }) => (
  <Content scrollable={scrollable}>{children}</Content>
);

export default CardContent;
