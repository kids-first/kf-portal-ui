import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import tinygradient from 'tinygradient';
import { ResponsivePie } from '@nivo/pie';
import Tooltip from './Tooltip';

const PieWrapper = styled('div')`
  height: 100%;
  display: block;
  text-align: center;
`;

const PieTitle = styled('div')`
  font-size: 14px;
  margin-left: -14px;
  font-weight: 600;
  color: #404c9a;
  margin-bottom: 5px;
`;

const PieTooltip = ({ id, value, label }) => (
  <Tooltip key={id}>
    <div>{label || id}</div>
    <div>{`${value} Members`}</div>
  </Tooltip>
);

class Pie extends Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render() {
    const gradient = tinygradient(...this.props.colors).rgb(this.props.data.length + 1);
    const colorData = this.props.data.map((d, i) => ({
      ...d,
      color: gradient[i].toHexString(),
      index: i,
    }));

    return (
      <PieWrapper style={this.props.style}>
        {this.props.title ? <PieTitle>{this.props.title}</PieTitle> : null}
        <ResponsivePie {...this.props} data={colorData} colorBy={data => data.color} />
      </PieWrapper>
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
  onClick: x => x,
};

Pie.propTypes = {
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Pie;
