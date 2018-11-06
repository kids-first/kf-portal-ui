import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import _ from 'lodash';

import { defaultTheme } from '../themes';
import Legend from './Legend';
import { truncateText, maxValues } from '../utils';

const Tooltip = ({ id, value, index, color, data }) => (
  <div keys={index}>{`${data.maxVal.toLocaleString()} Participants`}</div>
);

const HorizontalBarWrapper = styled('div')`
  height: calc(100% - 20px);
`;

class HorizontalBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: null,
    };

    const { data, keys } = props;
    this.dataMaxValues = maxValues(data, keys);
    //  this.chartMaxValue = chartMaxValue(maxValues);

    this.data = _(data)
      .filter(x => x)
      .sortBy(data, d => d.id)
      .map(d => {
        const maxVal = this.dataMaxValues[d.id];
        return { ...d, maxVal };
      })
      .value();

    console.log('dddd', data, this.chartData);
  }

  onMouseEnter(data, e) {
    console.log('Mouse enter!', data, typeof data.index, 'state', this.state);
    if (data) {
      const { index, indexValue } = data;
      console.log('data', data);
      this.setState({ highlighted: { index, indexValue } });
    }
  }

  onMouseLeave(data, e) {}

  render() {
    const tickValues = 0;
    const {
      keys,
      colors,
      tickInterval = 5,
      legends,
      indexBy = 'id',
      xTickTextLength = 10,
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
          onMouseLeave={(data, e) => {
            //  console.log('Mouse leave!');
            this.setState({ highlighted: null });
          }}
          margin={{
            top: 0,
            right: 8,
            bottom: 30,
            left: 160,
          }}
          padding={0.3}
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
              match: x =>
                x.data.index === this.state.highlighted ? this.state.highlighted.index : null,
              id: 'lines',
            },
          ]}
          colorBy="id"
          layout="horizontal"
          borderColor="inherit:darker(1.6)"
          axisBottom={{
            orient: 'bottom',
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: '# Participants',
            legendPosition: 'middle',
            legendOffset: 20,
            //  tickValues: tickValues,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            renderTick: tick => {
              const { format, key, x, y, theme } = tick;
              // console.log('format', format, 'key', key, 'theme', theme);
              let value = tick.value;

              // Custom formatting
              if (format !== undefined) {
                value = format(value);
              }

              const croppedValue = truncateText(value, xTickTextLength);

              const xOffset = 160;

              const highlighted = this.state.highlighted;
              const { index, indexValue } = highlighted ? highlighted : null;
              //   const highlighted = value === indexValue ? { fill: 'red' } : {};

              console.log('indexvalue', indexValue, 'value', value, 'highlighted', highlighted);
              return (
                <g key={key} transform={`translate(${x - xOffset},${y})`}>
                  <text
                    textAnchor="start"
                    alignmentBaseline="middle"
                    style={{ ...theme.axis.ticks.text, ...highlighted }}
                  >
                    {croppedValue}
                  </text>
                </g>
              );
            },
          }}
          enableGridX={true}
          // gridXValues={tickValues}
          // maxValue={_.max(this.maxValues) + 50}
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
};

export default HorizontalBar;
