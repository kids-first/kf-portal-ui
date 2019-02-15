import React from 'react';
import PropTypes from 'prop-types';

import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { CardWrapper, HeaderWrapper } from './styles';

const Card = ({
  Header,
  Content = CardContent,
  children,
  className,
  scrollable,
  title,
  inactive = false,
  showHeader = true,
}) => {
  const DefaultHeader = <CardHeader title={title} />;

  return (
    <CardWrapper className={className} inactive={inactive}>
      {showHeader && <HeaderWrapper inactive={inactive}>{Header || DefaultHeader}</HeaderWrapper>}
      <Content scrollable={scrollable}>{children}</Content>
    </CardWrapper>
  );
};

Card.propTypes = {
  Header: PropTypes.node,
  Content: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  scrollable: PropTypes.bool,
  title: PropTypes.node,
  inactive: PropTypes.bool,
  showHeader: PropTypes.bool,
};

export default Card;
