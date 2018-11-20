import React from 'react';

import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { CardWrapper } from './styles';

const Card = ({ Header, Content = CardContent, children, className, scrollable, title }) => {
  const DefaultHeader = <CardHeader title={title} />;

  return (
    <CardWrapper className={className}>
      {Header || DefaultHeader}
      <Content scrollable={scrollable}>{children}</Content>
    </CardWrapper>
  );
};

export default Card;
