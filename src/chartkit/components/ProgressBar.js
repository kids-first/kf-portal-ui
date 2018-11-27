import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  render() {
    const { percent, width, onHover, onClick, strokeColor, trailColor, style } = this.props;

    const pathStyle = {
      strokeDasharray: '100px, 100px',
      strokeDashoffset: `${100 - percent}px`,
    };

    const center = width / 2;
    const right = 100 - width / 2;
    const pathString = `M ${center},${center} L ${right},${center}`;
    const viewBoxString = `0 0 100 ${width}`;

    return (
      <svg
        viewBox={viewBoxString}
        preserveAspectRatio="none"
        style={{ pointerEvents: 'all', ...style }}
        onClick={onClick}
        onMouseOver={e => this.setState({ hover: true })}
        onMouseLeave={e => this.setState({ hover: false })}
      >
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
  }
}

ProgressBar.defaultProps = {
  percent: 0,
  strokeColor: '#f79122',
  trailColor: '#cacbcf',
  width: 2,
  style: {},
};

ProgressBar.propTypes = {
  percent: PropTypes.number,
  strokeColor: PropTypes.string,
  width: PropTypes.number,
};

export default ProgressBar;
