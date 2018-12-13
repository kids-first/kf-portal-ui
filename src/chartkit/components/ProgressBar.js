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
    const { percent, height, onClick, percentColor, trailColor, style } = this.props;

    const percentWidth = `${percent}%`;

    const svgStyle = {
      pointerEvents: 'all',
      cursor: this.state.hover ? 'pointer' : 'default',
      width: '100%',
      height: `${height}px`,
      ...style,
    };

    const radius = height / 2;

    return (
      <svg
        preserveAspectRatio="none"
        style={svgStyle}
        onClick={onClick}
        onMouseOver={() => this.setState({ hover: true })}
        onMouseLeave={() => this.setState({ hover: false })}
      >
        <defs>
          <pattern
            id="lines"
            width="14.142135623730951"
            height="14.14213562373095"
            patternUnits="userSpaceOnUse"
          >
            <rect
              width="14.142135623730951"
              height="14.14213562373095"
              fill={percentColor}
              stroke="rgba(255, 0, 0, 0.1)"
              strokeWidth="0"
            />
            <path
              d="M -14.142135623730951 14.14213562373095 L 14.142135623730951 -14.14213562373095 M -14.142135623730951 28.2842712474619 L 28.284271247461902 -14.14213562373095 M 0 28.2842712474619 L 28.284271247461902 0"
              strokeWidth="4"
              stroke="#ffffff54"
              strokeLinecap="square"
            />
          </pattern>
        </defs>

        <rect width={'100%'} height="100%" fill={trailColor} rx={radius} />
        <rect
          width={percentWidth}
          height="100%"
          fill={this.state.hover ? 'url(#lines)' : percentColor}
          rx={radius}
        />
      </svg>
    );
  }
}

ProgressBar.defaultProps = {
  percent: 50,
  percentColor: '#f79122',
  trailColor: '#cacbcf',
  style: {},
  height: 10,
  onClick: x => x,
};

ProgressBar.propTypes = {
  percent: PropTypes.number,
  percentColor: PropTypes.string,
  height: PropTypes.number,
  onClick: PropTypes.func,
};

export default ProgressBar;
