import React, { Component } from 'react';
import { linearGradientDef } from '@nivo/core';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import _ from 'lodash';
import tinygradient from 'tinygradient';

import { defaultTheme } from '../themes';
import Legend from './Legend';
import Tooltip from './Tooltip';
import { truncateText, maxValues, getChartMaxValue, roundTo, getDataRangeSize } from '../utils';

const DonutWrapper = styled('div')`
  height: calc(100% - 20px);
`;

class Donut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      highlightedIndexValue: null,
    };

    const { data, colors } = this.props;
    const gradient = tinygradient(...colors).rgb(data.length + 1);
    data.forEach((d, i) => {
      d.color = gradient[i].toHexString();
      d.index = i;
    });

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(data, e) {
    if (this.interactive) e.target.style.cursor = 'pointer';
    if (data) {
      const { index, value } = data;
      this.setState({ highlightedIndex: index, highlightedIndexValue: value });
    }
  }

  onMouseLeave(data, e) {
    this.setState({ highlightedIndex: null, highlightedIndexValue: null });
  }

  render() {
    const { keys, colors, interactive, height } = this.props;

    const chartData = {
      data: this.props.data,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      margin: {
        top: 30,
        right: 20,
        bottom: 20,
        left: 20,
      },
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
      fill: [
        {
          match: x => x.data.index === this.state.highlightedIndex,
          id: 'lines',
        },
      ],
      sortByValue: true,
      colors: colors,
      innerRadius: 0.5,
      colors: 'reds',
      colorBy: data => data.color,
      borderWidth: 1,
      borderColor: '#ffffff',
      radialLabelsSkipAngle: 10,
      radialLabelsTextXOffset: 6,
      radialLabelsTextColor: '#333333',
      radialLabelsLinkOffset: 0,
      radialLabelsLinkDiagonalLength: 16,
      radialLabelsLinkHorizontalLength: 24,
      radialLabelsLinkStrokeWidth: 1,
      radialLabelsLinkColor: '#333333',
      enableSlicesLabels: false,
      animate: true,
      motionStiffness: 90,
      motionDamping: 15,
      // tooltip: null,
      theme: defaultTheme,
      // tooltip: null,
      isInteractive: false,
    };

    return (
      <DonutWrapper>
        {height ? (
          <ResponsivePie {...chartData} height={height} />
        ) : (
          <ResponsivePie {...chartData} />
        )}
      </DonutWrapper>
    );
  }
}

Donut.propTypes = {
  data: PropTypes.array,
  colors: PropTypes.arrayOf(PropTypes.string),
  interactive: PropTypes.bool,
};

export default Donut;
