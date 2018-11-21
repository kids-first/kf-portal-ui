import React, { Component } from 'react';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import tinygradient from 'tinygradient';
import { truncate } from 'lodash';

import { defaultTheme } from '../themes';
import ChartDisplayContainer from './ChartDisplayContainer';
import Tooltip from './Tooltip';

const DonutWrapper = styled('div')`
  height: 90%;
`;

const DonutTooltip = ({ id, value }) => (
  <Tooltip key={id}>
    <div>{id}</div>
    <div>{`${value} Members`}</div>
  </Tooltip>
);

class Donut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      highlightedIndexValue: null,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(data, e) {
    if (this.props.interactive) e.target.style.cursor = 'pointer';
    if (data) {
      const { index, value } = data;
      this.setState({ highlightedIndex: index, highlightedIndexValue: value });
    }
  }

  onMouseLeave(data, e) {
    this.setState({ highlightedIndex: null, highlightedIndexValue: null });
  }

  render() {
    const { height, data: rawData, colors } = this.props;

    /*****
     * If we find performance issues with this component, we can try caching
     * the gradient array and only recompute when data length changes
     ******/
    const gradient = tinygradient(...colors).rgb(rawData.length + 1);
    const data = rawData.map((d, i) => ({
      ...d,
      color: gradient[i].toHexString(),
      index: i,
    }));

    const chartData = {
      data: data,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      margin: { top: 30, right: 84, bottom: 30, left: 84 },
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
      fill: [{ match: x => x.data.index === this.state.highlightedIndex, id: 'lines' }],
      sortByValue: true,
      innerRadius: 0.5,
      colors: 'reds',
      colorBy: data => data.color,
      borderWidth: 1,
      borderColor: '#ffffff',
      radialLabelsSkipAngle: 10,
      radialLabelsTextXOffset: 6,
      radialLabelsTextColor: '#333333',
      radialLabelsLinkOffset: 0,
      radialLabelsLinkDiagonalLength: 12,
      radialLabelsLinkHorizontalLength: 10,
      radialLabelsLinkStrokeWidth: 1,
      radialLabelsLinkColor: '#333333',
      radialLabel: d => truncate(d.label, { length: 12 }),
      enableSlicesLabels: false,
      animate: true,
      motionStiffness: 90,
      motionDamping: 15,
      theme: defaultTheme,
      tooltip: DonutTooltip,
    };

    return (
      <DonutWrapper>
        <ChartDisplayContainer>
          {height ? (
            <ResponsivePie {...chartData} height={height} />
          ) : (
            <ResponsivePie {...chartData} />
          )}
        </ChartDisplayContainer>
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
