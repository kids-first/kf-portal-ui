import React from 'react';
import PropTypes from 'prop-types';

import './CircleIcon.css';

const CircleIcon = ({ color, fill = '#fff', size, iconSize = size - 32, Icon }) => (
  <div className="circleIcon-container" style={{ height: size, width: size }}>
    <div
      className="circleIcon-content"
      style={{ backgroundColor: color, height: size - 10, width: size - 10 }}
    >
      <Icon width={`${iconSize}px`} height={`${iconSize}px`} fill={fill} />
    </div>
  </div>
);

CircleIcon.propTypes = {
  color: PropTypes.string.isRequired,
  fill: PropTypes.string,
  size: PropTypes.number.isRequired,
  iconSize: PropTypes.number,
  Icon: PropTypes.elementType.isRequired,
};

export default CircleIcon;
