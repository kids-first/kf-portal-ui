import React from 'react';

import Row from 'uikit/Row';

import { cardWrapper, headerWrapper } from './Card.module.css';

export const CardWrapper = ({
  inactive = false,
  className = '',
  children = null,
  cardWrapperStyle = {},
  style = {},
  ...props
}) => (
  <div
    className={`${cardWrapper} ${className} ${inactive ? 'inactive' : ''}`}
    style={{
      ...cardWrapperStyle,
      ...style,
    }}
    {...props}
  >
    {children}
  </div>
);

export const HeaderWrapper = ({ inactive = false, className = '', children = null, ...props }) => {
  return (
    <Row className={`${headerWrapper} ${className} ${inactive ? 'inactive' : ''}`} {...props}>
      {children}
    </Row>
  );
};
