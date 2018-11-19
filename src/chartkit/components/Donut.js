import React, { Component } from 'react';
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import tinygradient from 'tinygradient';

import { defaultTheme } from '../themes';

const DonutWrapper = styled('div')`
  height: 90%;
`;

const DonutTooltip = ({ id, value }) => (
  <div style={{ fill: '#404c9a' }} keys={id}>{`${value} Members`}</div>
);

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
    const { height } = this.props;

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
      radialLabelsLinkHorizontalLength: 16,
      radialLabelsLinkStrokeWidth: 1,
      radialLabelsLinkColor: '#333333',
      enableSlicesLabels: false,
      animate: true,
      motionStiffness: 90,
      motionDamping: 15,
      theme: defaultTheme,
      tooltip: DonutTooltip,
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
