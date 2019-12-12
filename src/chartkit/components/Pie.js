import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tinygradient from 'tinygradient';
import { ResponsivePie } from '@nivo/pie';

import Tooltip from './Tooltip';

import './Pie.css';

const PieTooltip = ({ id, value, label }) => (
  <Tooltip className="pieTooltip" key={id}>
    <div>{label || id}</div>
    <div>{`${value} Participants`}</div>
  </Tooltip>
);

class Pie extends Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {
      highlightedIndex: null,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(data, e) {
    if (data) {
      const { index } = data;
      this.setState({ highlightedIndex: index });
    }
    e.target.style.cursor = 'pointer';
  }

  onMouseLeave(data, e) {
    this.setState({ highlightedIndex: null });
  }

  render() {
    const gradient = tinygradient(...this.props.colors).rgb(this.props.data.length + 2); // .rgb expects a value > 2
    const colorData = this.props.data.map((d, i) => ({
      ...d,
      color: gradient[i].toHexString(),
      index: i,
    }));

    return (
      <div className="pieWrapper" style={this.props.style}>
        {this.props.title ? <div className="pieTitle">{this.props.title}</div> : null}
        <ResponsivePie
          {...this.props}
          data={colorData}
          colorBy={data => data.color}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          fill={[{ match: x => x.data.index === this.state.highlightedIndex, id: 'lines' }]}
        />
      </div>
    );
  }
}

Pie.defaultProps = {
  margin: {
    right: 18,
    bottom: 16,
    left: 2,
  },
  enableRadialLabels: false,
  enableSlicesLabels: false,
  sliceLabel: 'id',
  slicesLabelsTextColor: 'inherit:darker(1.5)',
  sortByValue: true,
  innerRadius: 0,
  cornerRadius: 0,
  padAngle: 0,
  borderWidth: 0,
  borderColor: 'inherit:darker(0.5)',
  colorBy: 'id',
  isInteractive: true,
  colors: 'greys',
  tooltip: PieTooltip,
  defs: [
    {
      id: 'lines',
      type: 'patternLines',
      background: 'inherit',
      color: '#ffffff54',
      rotation: -45,
      lineWidth: 4,
      spacing: 10,
    },
  ],
};

Pie.propTypes = {
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Pie;
