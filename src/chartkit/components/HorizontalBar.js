import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import { defaultTheme } from '../themes';
import Legend from './Legend';
import Tooltip from './Tooltip';
import { truncateText } from '../utils';
import ChartDisplayContainer from './ChartDisplayContainer';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const HorizontalBarWrapper = styled('div')`
  height: 90%;
`;

/**
 * Ref: https://github.com/kids-first/kf-portal-ui/pull/1006
 * IE, FF and Chrome all deal with svg text alignment differently
 * Nivo uses alignment-baseline which FF does not support
 * TextBugWrapper provides FF with correct attribute
 */
const TextBugWrapper = styled('div')`
  width: 100%;
  height: 100%;
  & text {
    dominant-baseline: ${({ baseline }) => baseline};
  }
`;

class HorizontalBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      highlightedIndexValue: null,
    };

    const { data, sortBy, tickInterval } = props;

    // const maxValue = getChartMaxValue(data, keys);
    this.maxValue = tickInterval ? this.maxValue : 'auto';

    this.tickValues = tickInterval;

    this.data = data.filter(x => x).sort(sortBy);

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
      if (this.props.analyticsTracking) {
        trackUserInteraction({
          category: this.props.analyticsTracking.category,
          action: `Chart Bar: ${TRACKING_EVENTS.actions.hover}`,
          label: `${data.indexValue}: ${data.id}`,
        });
      }
    }
  }

  onMouseLeave(data, e) {
    //   e.target.style.cursor = 'default';
    this.setState({ highlightedIndex: null, highlightedIndexValue: null });
  }

  onClick(data) {
    const { onClick } = this.props;
    if (onClick) onClick(data);
  }

  renderAxisLeftTick(tick) {
    const { highlightedIndexValue } = this.state;
    const { onClick, xTickTextLength = 10 } = this.props;
    const { format, key, x, y, theme, tickIndex } = tick;

    let value = tick.value;

    if (format !== undefined) {
      value = format(value);
    }

    const text = truncateText(value, xTickTextLength);

    const xOffset = 160;

    const highlighted = value === highlightedIndexValue ? { fill: '#2b388f' } : {};

    const onLabelClick = tick => {
      const data = this.data.find(d => d.label === tick.value);
      if (data) {
        onClick({ data });
      }
    };

    return (
      <g
        key={key}
        transform={`translate(${x - xOffset},${y})`}
        style={{ cursor: highlighted ? 'pointer' : 'default' }}
        onMouseEnter={e => this.onMouseEnter({ index: tickIndex, indexValue: key }, e)}
        onMouseLeave={this.onMouseLeave}
      >
        <text
          className="tickTextAxisLeft"
          textAnchor="start"
          alignmentBaseline="middle"
          style={{ ...theme.axis.ticks.text, ...highlighted }}
          onClick={() => onLabelClick(tick)}
        >
          {text}
        </text>
      </g>
    );
  }

  render() {
    const { keys, colors, legends, indexBy = 'id', height, tooltipFormatter } = this.props;

    const chartData = {
      data: this.data,
      keys: keys,
      indexBy: indexBy,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onClick: this.onClick,
      margin: {
        top: 0,
        right: 8,
        bottom: 70,
        left: 160,
      },
      padding: this.props.padding ? this.props.padding : 0.3,
      colors: colors,
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
      colorBy: 'id',
      layout: 'horizontal',
      borderColor: 'inherit:darker(1.6)',
      axisBottom: {
        format: v => v.toLocaleString(),
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: '# Participants',
        legendPosition: 'middle',
        legendOffset: 38,
        tickValues: this.tickValues,
      },
      axisLeft: {
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        renderTick: this.renderAxisLeftTick,
      },
      enableGridX: true,
      gridXValues: undefined,
      maxValue: this.maxValue,
      enableGridY: false,
      enableLabel: false,
      labelSkipWidth: 12,
      labelSkipHeight: 12,
      labelTextColor: 'inherit:darker(1.6)',
      animate: true,
      motionStiffness: 90,
      motionDamping: 15,
      isInteractive: true,
      theme: defaultTheme,
      tooltip: props => <Tooltip {...props} formatter={tooltipFormatter} />,
    };

    return (
      <HorizontalBarWrapper>
        {!legends ? null : <Legend legends={legends} theme={defaultTheme.legend} />}
        <TextBugWrapper baseline="text-before-edge">
          <ChartDisplayContainer>
            {height ? (
              <ResponsiveBar {...chartData} height={height} />
            ) : (
              <ResponsiveBar {...chartData} />
            )}
          </ChartDisplayContainer>
        </TextBugWrapper>
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
  analyticsTracking: PropTypes.shape({ category: PropTypes.string }),
};

export default HorizontalBar;
