import React from 'react';
import styled from 'react-emotion';
import PropTypes from 'prop-types';

const IconWrapper = styled('div')`
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid #e0e1e6;
  background-color: #fff;
`;

const IconBackground = styled('div')`
  background-color: #aaaec1;
  border-radius: 50%;
  padding: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CircleIcon = ({ color, fill, size, iconSize, Icon, style, ...props }) => (
  <IconWrapper style={{ height: size, width: size }}>
    <IconBackground style={{ backgroundColor: color, height: size - 10, width: size - 10 }}>
      <Icon width={iconSize || size - 32} height={iconSize || size - 32} fill={fill || '#fff'} />
    </IconBackground>
  </IconWrapper>
);

CircleIcon.propTypes = {
  color: PropTypes.string,
  fill: PropTypes.string,
  size: PropTypes.number,
  iconSize: PropTypes.number,
  Icon: PropTypes.elementType,
};

export default CircleIcon;
