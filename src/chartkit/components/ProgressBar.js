import React from 'react';
import PropTypes from 'prop-types';

const ProgressBar = ({ percent, width, strokeColor, trailColor }) => {
  const pathStyle = {
    strokeDasharray: '100px, 100px',
    strokeDashoffset: `${100 - percent}px`,
  };

  const center = width / 2;
  const right = 100 - width / 2;
  const pathString = `M ${center},${center} L ${right},${center}`;
  const viewBoxString = `0 0 100 ${width}`;

  return (
    <svg viewBox={viewBoxString} preserveAspectRatio="none">
      <path
        d={pathString}
        strokeLinecap={'round'}
        stroke={trailColor}
        strokeWidth={width}
        fillOpacity="0"
      />
      <path
        d={pathString}
        strokeLinecap={'round'}
        stroke={strokeColor}
        strokeWidth={width}
        fillOpacity="0"
        style={pathStyle}
      />
    </svg>
  );
};

ProgressBar.defaultProps = {
  percent: 0,
  strokeColor: '#f79122',
  trailColor: '#cacbcf',
  width: 2,
};

ProgressBar.propTypes = {
  percent: PropTypes.number,
  strokeColor: PropTypes.string,
  width: PropTypes.number,
};

export default ProgressBar;
