import React from 'react';
import PropTypes from 'prop-types';

import CardContent from './CardContent';
import CardHeader from './CardHeader';
import { CardWrapper, HeaderWrapper } from './styles';

const Card = ({
  Header,
  Content = CardContent,
  children,
  cardWrapperStyle,
  scrollable,
  title,
  inactive = false,
  showHeader = true,
  headerWrapperStyle,
}) => {
  const DefaultHeader = <CardHeader title={title} />;

  return (
    <CardWrapper cardWrapperStyle={cardWrapperStyle} inactive={inactive}>
      {showHeader && (
        <HeaderWrapper headerWrapperStyle={headerWrapperStyle} inactive={inactive}>
          {Header || DefaultHeader}
        </HeaderWrapper>
      )}
      <Content scrollable={scrollable}>{children}</Content>
    </CardWrapper>
  );
};

Card.propTypes = {
  Header: PropTypes.node,
  Content: PropTypes.func,
  children: PropTypes.node,
  scrollable: PropTypes.bool,
  title: PropTypes.node,
  inactive: PropTypes.bool,
  showHeader: PropTypes.bool,
};

export default Card;
