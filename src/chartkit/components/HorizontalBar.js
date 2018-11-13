import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import _ from 'lodash';

import { defaultTheme } from '../themes';
import Legend from './Legend';
import Tooltip from './Tooltip';
import { truncateText, maxValues, getChartMaxValue, roundTo, getDataRangeSize } from '../utils';

const HorizontalBarWrapper = styled('div')`
  height: calc(100% - 20px);
`;

class HorizontalBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      highlightedIndexValue: null,
    };

    const { data, keys, sortBy, tickInterval } = props;
    this.dataMaxValues = maxValues(data, keys);

    const maxValue = getChartMaxValue(data, keys);
    this.maxValue = tickInterval ? this.maxValue : 'auto';

    this.tickValues = tickInterval;

    this.data = data
      .filter(x => x)
      .sort(sortBy)
      .map(d => {
        const maxVal = this.dataMaxValues[d.id];
        return { ...d, maxVal };
      });

    this.renderAxisLeftTick = this.renderAxisLeftTick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onMouseEnter(data, e) {
    e.target.style.cursor = 'pointer';
    if (data) {
      const { index, indexValue } = data;
      this.setState({ highlightedIndex: index, highlightedIndexValue: indexValue });
    }
  }

  onMouseLeave(data, e) {
    e.target.style.cursor = 'default';
    this.setState({ highlightedIndex: null, highlightedIndexValue: null });
  }

  onClick(data) {
    const { onClick } = this.props;
    onClick ? onClick(data) : null;
  }

  renderAxisLeftTick(tick) {
    const { highlightedIndexValue } = this.state;
    const { xTickTextLength } = this.props;
    const { format, key, x, y, theme } = tick;

    let value = tick.value;

    if (format !== undefined) {
      value = format(value);
    }

    const text = truncateText(value, xTickTextLength);

    const xOffset = 160;

    const highlighted = value === highlightedIndexValue ? { fill: 'red' } : {};

    return (
      <g
        ref={this.textRef}
        key={key}
        transform={`translate(${x - xOffset},${y})`}
        style={{ cursor: highlighted ? 'pointer' : 'default' }}
      >
        <text
          className="tickTextAxisLeft"
          textAnchor="start"
          alignmentBaseline="middle"
          style={{ ...theme.axis.ticks.text, ...highlighted }}
        >
          {text}
        </text>
      </g>
    );
  }

  render() {
    const {
      keys,
      colors,
      tickInterval,
      legends,
      indexBy = 'id',
      xTickTextLength = 10,
      tickValues,
      ...overrides
    } = this.props;

    return (
      <HorizontalBarWrapper>
        {!legends ? null : <Legend legends={legends} theme={defaultTheme.legend} />}
        <ResponsiveBar
          data={this.data}
          keys={keys}
          indexBy={indexBy}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onClick}
          margin={{
            top: 0,
            right: 8,
            bottom: 70,
            left: 160,
          }}
          padding={this.props.padding ? this.props.padding : 0.3}
          colors={colors}
          defs={[
            {
              id: 'lines',
              type: 'patternLines',
              background: 'inherit',
              color: '#ffffff54',
              rotation: -45,
              lineWidth: 4,
              spacing: 10,
            },
          ]}
          fill={[
            {
              match: x => x.data.index === this.state.highlightedIndex,
              id: 'lines',
            },
          ]}
          colorBy="id"
          layout="horizontal"
          borderColor="inherit:darker(1.6)"
          axisBottom={{
            format: v => v.toLocaleString(),
            orient: 'bottom',
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: '# Participants',
            legendPosition: 'middle',
            legendOffset: 38,
            tickValues: this.tickValues,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            renderTick: this.renderAxisLeftTick,
          }}
          enableGridX={true}
          gridXValues={undefined}
          maxValue={this.maxValue}
          enableGridY={false}
          enableLabel={false}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="inherit:darker(1.6)"
          animate={true}
          motionStiffness={90}
          motionDamping={15}
          tooltip={null}
          isInteractive={true}
          theme={defaultTheme}
          tooltip={Tooltip}
        />
      </HorizontalBarWrapper>
    );
  }
}

HorizontalBar.propTypes = {
  maxValue: PropTypes.number,
  tickValues: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.array,
  keys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.func,
};

export default HorizontalBar;
