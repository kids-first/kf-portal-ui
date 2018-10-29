import React from 'react';
import styled from 'react-emotion';

import CardContent from './CardContent';
import CardHeader from './CardHeader';

const CardWrapper = styled('div')``;

const Card = ({ Header = CardHeader, Content = CardContent, title, children }) => (
  <CardWrapper>
    <Header title={title} />
    <Content>{children}</Content>
  </CardWrapper>
);

export default Card;
