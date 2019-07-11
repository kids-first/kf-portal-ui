import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import autobind from 'auto-bind-es5';

import { defaultTheme } from '../themes';
import Legend from './Legend';
import Tooltip from './Tooltip';
import { truncateText } from '../utils';
import { TextBugWrapper } from '../styles';
import ChartDisplayContainer from './ChartDisplayContainer';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

const HorizontalBarWrapper = styled('div')`
  height: 100%;
  width: 100%;
`;

class HorizontalBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedIndex: null,
      highlightedIndexValue: null,
    };

    // TODO check that for participants tick interval < 1
    const { tickInterval } = props;
    this.maxValue = tickInterval ? this.maxValue : 'auto';
    this.tickValues = tickInterval;

    autobind(this);
  }

  onMouseEnter(data, e) {
    const { showCursor = true } = this.props;
    e.target.style.cursor = showCursor ? 'pointer' : 'default';

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
    const target = e ? e.target : false;
    if (target) {
      target.style.cursor = 'default';
    }
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

    const value = typeof format === 'function' ? format(tick.value) : tick.value;

    const text = truncateText(value, xTickTextLength);

    //const valueLength = value.toString().length;
    const xOffset = 160;

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

  sumUpKeys(obj) {
    return this.props.sortByKeys.reduce((sum, key) => (sum += obj[key]), 0);
  }

  defaultSort(datumA, datumB) {
    if (/desc(ending)?/i.test('' + this.props.sortOrder)) {
      return this.sumUpKeys(datumA) - this.sumUpKeys(datumB);
    }
    return this.sumUpKeys(datumB) - this.sumUpKeys(datumA);
  }

  sortData(data) {
    const { sortBy, sortByKeys = null } = this.props;
    const sortFn =
      typeof sortBy === 'function'
        ? sortBy
        : sortBy === false
        ? null
        : sortBy === true || sortByKeys
        ? this.defaultSort
        : null;
    const filteredData = data.filter(x => x);
    return sortFn ? filteredData.sort(sortFn) : filteredData;
  }

  render() {
    const {
      data = [],
      keys,
      colors,
      legends,
      indexBy = 'id',
      height,
      tooltipFormatter,
      axisBottomFormat = v => Number.isInteger(Number(v)) ? v.toLocaleString() : "",
      axisLeftFormat = v => v.toLocaleString(),
    } = this.props;

    const chartData = {
      data: this.sortData(data),
      keys: keys,
      indexBy: indexBy,
      onMouseEnter: this.onMouseEnter,
      onMouseLeave: this.onMouseLeave,
      onClick: this.onClick,
      margin: {
        top: 0,
        right: 10,
        bottom: 60,
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
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 8,
        tickRotation: 0,
        legend: '# Participants',
        legendPosition: 'middle',
        legendOffset: 38,
        tickValues: this.tickValues,
        format: axisBottomFormat,
      },
      axisLeft: {
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        renderTick: this.renderAxisLeftTick,
        format: axisLeftFormat,
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

    // see https://github.com/plouc/nivo/issues/164#issuecomment-488939712
    return (
      <HorizontalBarWrapper>
        {!legends ? null : <Legend legends={legends} theme={defaultTheme.legend} />}
        <TextBugWrapper baseline="central">
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
  sortByKeys: PropTypes.arrayOf(PropTypes.string),
  sortOrder: (props, propName, componentName) => {
    if (props[propName] && !/(a|de)sc(ending)?/i.test(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Validation failed.`,
      );
    }
  },
  axisBottomFormat: PropTypes.func,
  axisLeftFormat: PropTypes.func,
  analyticsTracking: PropTypes.shape({ category: PropTypes.string }),
};

export default HorizontalBar;
