import React from 'react';

import CardContent from '../CardContent';
import CardHeader from '../CardHeader';
import { CardWrapper } from '../styles';

const DualPaneCard = ({
  Header,
  Content = CardContent,
  children,
  className,
  scrollable,
  title,
  stackIndex,
  setStack,
}) => {
  return (
    <CardWrapper className={className}>
      {Header || <CardHeader title={title} />}
      <Content scrollable={scrollable}>{children}</Content>
      <div>Extra pane</div>
    </CardWrapper>
  );
};

export default DualPaneCard;
