import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import { defaultTheme } from '../themes';
import Legend from './Legend';
import { truncateText } from '../utils';

const HorizontalBar = ({
  data,
  keys,
  colors,
  tickValues,
  maxValue,
  legends,
  indexBy = 'id',
  xTickTextLength = 10,
  ...overrides
}) => (
  <div style={{ height: 'calc(100% - 20px)' }}>
    <ResponsiveBar
      data={data}
      keys={keys}
      indexBy={indexBy}
      margin={{
        top: 0,
        right: 50,
        bottom: 30,
        left: 160,
      }}
      padding={0.3}
      colors={colors}
      colorBy="id"
      layout="horizontal"
      borderColor="inherit:darker(1.6)"
      axisBottom={{
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        tickValues: tickValues,
      }}
      axisLeft={{
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        renderTick: tick => {
          const { format, key, x, y, theme } = tick;
          let value = tick.value;

          // Custom formatting
          if (format !== undefined) {
            value = format(value);
          }

          const croppedValue = truncateText(value, xTickTextLength);

          const xOffset = 160;

          return (
            <g key={key} transform={`translate(${x - xOffset},${y})`}>
              <text textAnchor="start" alignmentBaseline="middle" style={theme.axis.ticks.text}>
                {croppedValue}
              </text>
            </g>
          );
        },
      }}
      enableGridX={true}
      gridXValues={tickValues}
      maxValue={maxValue || tickValues[tickValues.length - 1] + 40}
      enableGridY={false}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="inherit:darker(1.6)"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
      tooltip={null}
      isInteractive={false}
      theme={defaultTheme}
      {...overrides}
    />
    {!legends ? null : (
      <Legend style={{ marginLeft: 160 }} legends={legends} theme={defaultTheme.legend} />
    )}
  </div>
);

HorizontalBar.propTypes = {
  maxValue: PropTypes.number,
  tickValues: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.array,
  keys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
};

export default HorizontalBar;
