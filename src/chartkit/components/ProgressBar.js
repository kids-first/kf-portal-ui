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
    const { percent, width, onHover, onClick, percentColor, trailColor, style } = this.props;

    const percentWidth = `calc(100% - ${100 - percent}%)`;

    const svgStyle = {
      pointerEvents: 'all',
      cursor: this.state.hover ? 'pointer' : 'default',
      ...style,
    };

    return (
      <svg
        preserveAspectRatio="none"
        style={svgStyle}
        onClick={onClick}
        onMouseOver={e => this.setState({ hover: true })}
        onMouseLeave={e => this.setState({ hover: false })}
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
              d="
                    M -14.142135623730951 14.14213562373095 L 14.142135623730951 -14.14213562373095
                    M -14.142135623730951 28.2842712474619 L 28.284271247461902 -14.14213562373095
                    M 0 28.2842712474619 L 28.284271247461902 0
                "
              strokeWidth="4"
              stroke="#ffffff54"
              strokeLinecap="square"
            />
          </pattern>
        </defs>

        <rect height={width} width={'100%'} fill={trailColor} rx={10} />
        <rect
          height={width}
          width={percentWidth}
          fill={this.state.hover ? 'url(#lines)' : percentColor}
          rx={10}
        />
      </svg>
    );
  }
}

ProgressBar.defaultProps = {
  percent: 0,
  percentColor: '#f79122',
  trailColor: '#cacbcf',
  width: 20,
  style: {},
};

ProgressBar.propTypes = {
  percent: PropTypes.number,
  percentColor: PropTypes.string,
  width: PropTypes.number,
};

export default ProgressBar;
