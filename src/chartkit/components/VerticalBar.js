import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styled from 'react-emotion';

import { defaultTheme } from '../themes';
import Legend from './Legend';
import Tooltip from './Tooltip';
import { truncateText } from '../utils';
import { TextBugWrapper } from '../styles';
import ChartDisplayContainer from './ChartDisplayContainer';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const VerticalBarWrapper = styled('div')`
  height: 90%;
`;

class VerticalBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      highlightedIndexValue: null,
    };

    const { tickInterval } = props;

    // const maxValue = getChartMaxValue(data, keys);
    this.maxValue = tickInterval ? this.maxValue : 'auto';

    this.tickValues = tickInterval;

    this.renderAxisLeftTick = this.renderAxisLeftTick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onMouseEnter(data, e) {
    const { showCursor = true } = this.props;
    if (showCursor) {
      e.target.style.cursor = 'pointer';
    }

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

    const xOffset = 25;

    const highlighted = value === highlightedIndexValue ? { fill: '#2b388f' } : {};

    const onLabelClick = tick => {
      const data = this.props.data.find(d => d.label === tick.value);
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
    const {
      data,
      sortBy,
      keys,
      colors,
      legends,
      indexBy = 'id',
      height,
      tooltipFormatter,
    } = this.props;

    const chartData = {
      data: data.filter(x => x).sort(sortBy),
      keys: keys,
      indexBy: indexBy,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onClick: this.onClick,
      margin: {
        top: 20,
        right: 0,
        bottom: 50,
        left: 50,
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
      colorBy: 'label',
      layout: 'vertical',
      borderColor: 'inherit:darker(1.6)',
      axisTop: null,
      axisRight: null,
      axisBottom: {
        format: v => v.toLocaleString(),
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Age at Diagnosis (years)',
        legendPosition: 'middle',
        legendOffset: 35,
        tickValues: this.tickValues,
      },
      axisLeft: {
        legend: '# Participants',
        legendPosition: 'middle',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: -42,
        renderTick: this.renderAxisLeftTick,
      },
      enableGridX: false,
      gridXValues: undefined,
      maxValue: this.maxValue,
      enableGridY: true,
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
      <VerticalBarWrapper>
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
      </VerticalBarWrapper>
    );
  }
}

VerticalBar.propTypes = {
  maxValue: PropTypes.number,
  tickValues: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.array,
  keys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.func,
  analyticsTracking: PropTypes.shape({ category: PropTypes.string }),
};

export default VerticalBar;
