import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { ResponsivePie } from '@nivo/pie';

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


class Pie extends Component {
  constructor(props, defaultProps) {
    super(props, defaultProps);
    this.state = {};
  }

  render() {
    return (
     <PieWrapper style={this.props.style}>
       {this.props.title ? <PieTitle>{this.props.title}</PieTitle> : null }
       <ResponsivePie {...this.props} />
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
  borderWidth: 1,
  borderColor: 'inherit:darker(0.5)',
  colorBy: 'id',
  isInteractive: true,
  colors: 'greys',
  onClick: x => x,
};

Pie.propTypes = {
  isInteractive: PropTypes.bool,
  colors: PropTypes.oneOf([
    'purples', 'blues', 'oranges', 'red_purple'
  ]),
  onClick: PropTypes.func,
};

export default Pie;
