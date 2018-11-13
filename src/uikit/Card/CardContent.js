import React from 'react';
import styled from 'react-emotion';

const Content = styled('div')`
  overflow: hidden;
  height: 100%;
`;

const CardContent = ({ children }) => <Content>{children}</Content>;

export default CardContent;
