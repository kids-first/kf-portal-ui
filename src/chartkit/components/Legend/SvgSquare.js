import React from 'react';
import PropTypes from 'prop-types';

const SvgSquare = ({ x = '0', y = '0', fill = 'black', width = '20', height = '20' }) => (
  <rect
    x={x}
    y={y}
    fill={fill}
    strokeWidth="0"
    stroke="transparent"
    width={width}
    height={height}
    style={{ pointerEvents: 'none' }}
  />
);

SvgSquare.propTypes = {
  x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fill: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default SvgSquare;
