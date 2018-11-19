import React from 'react';
import styled from 'react-emotion';

import { applyDefaultStyles } from 'uikit/Core';

import CardContent from './CardContent';
import CardHeader from './CardHeader';

const CardWrapper = applyDefaultStyles(styled('div')`
  border-radius: 10px;
  box-shadow: 0 0 9.5px 0.5px rgba(160, 160, 163, 0.25);
  background-color: rgba(255, 255, 255, ${({ inactive }) => (inactive ? '50%' : '100%')});
  padding: 26px 30px;
  display: flex;
  flex-direction: column;
  border: solid 1px #e0e1e6;
`);

const Card = ({
  Header = CardHeader,
  Content = CardContent,
  title,
  children,
  className,
  scrollable,
  badge,
  stack,
  stackIndex,
}) => (
  <CardWrapper className={className}>
    <Header title={title} badge={badge} stack={stack} stackIndex={stackIndex} />
    <Content scrollable={scrollable}>{children}</Content>
  </CardWrapper>
);

export default Card;
