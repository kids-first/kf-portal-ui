import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import PropTypes from 'prop-types';

import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';

import { TextBugWrapper } from '../styles';
import { defaultTheme } from '../themes';
import { truncateText } from '../utils';

import Legend from './Legend';
import Tooltip from './Tooltip';

import { verticalBarWrapper } from 'chartkit/chartkit.module.css';

class VerticalBar extends Component {
  state = {
    highlightedIndex: null,
    highlightedIndexValue: null,
  };

  onMouseEnter = (data, e) => {
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
  };

  onMouseLeave = (data, e) => {
    const target = e ? e.target : false;
    if (target) {
      target.style.cursor = 'default';
    }
    this.setState({ highlightedIndex: null, highlightedIndexValue: null });
  };

  onClick = (data) => {
    const { onClick } = this.props;
    if (onClick) onClick(data);
  };

  renderAxisLeftTick = (tick) => {
    const { highlightedIndexValue } = this.state;
    const { onClick, xTickTextLength = 10 } = this.props;
    const { format, key, x, y, tickIndex } = tick;

    const value = typeof format === 'function' ? format(tick.value) : tick.value;

    const text = truncateText(value, xTickTextLength);

    const valueLength = value.toString().length;
    const xOffset = 20 + 5 * (valueLength - 2);

    const highlighted = value === highlightedIndexValue ? { fill: '#2b388f' } : {};

    const onLabelClick = (tick) => {
      const data = this.props.data.find((d) => d.label === tick.value);
      if (data) {
        onClick({ data });
      }
    };

    return (
      <g
        key={key}
        transform={`translate(${x - xOffset},${y})`}
        style={{ cursor: highlighted ? 'pointer' : 'default' }}
        onMouseEnter={(e) => this.onMouseEnter({ index: tickIndex, indexValue: key }, e)}
        onMouseLeave={this.onMouseLeave}
      >
        <text
          className="tickTextAxisLeft"
          textAnchor="start"
          alignmentBaseline="middle"
          style={{ ...defaultTheme.axis.ticks.text, ...highlighted }}
          onClick={() => onLabelClick(tick)}
        >
          {text}
        </text>
      </g>
    );
  };

  sumUpKeys = (obj) => this.props.sortByKeys.reduce((sum, key) => (sum += obj[key]), 0);

  defaultSort = (datumA, datumB) => {
    if (/desc(ending)?/i.test('' + this.props.sortOrder)) {
      return this.sumUpKeys(datumB) - this.sumUpKeys(datumA);
    }
    return this.sumUpKeys(datumA) - this.sumUpKeys(datumB);
  };

  sortData = (data) => {
    const { sortBy, sortByKeys = null } = this.props;
    const sortFn =
      typeof sortBy === 'function'
        ? sortBy
        : sortBy === false
        ? null
        : sortBy === true || sortByKeys
        ? this.defaultSort
        : null;
    const filteredData = data.filter((x) => x);
    return sortFn ? filteredData.sort(sortFn) : filteredData;
  };

  render() {
    const {
      data = [],
      keys,
      colors,
      legends,
      indexBy = 'id',
      height,
      tooltipFormatter,
      axisLeftLegend = '',
      axisBottomLegend = '',
      axisLeftFormat = (v) => (Number.isInteger(Number(v)) ? v.toLocaleString() : ''),
      axisBottomFormat = (v) => v.toLocaleString(),
      bottomLegendOffset = 35,
      leftLegendOffset = -40,
      tickInterval,
    } = this.props;

    const chartData = {
      data: this.sortData(data),
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
          match: (x) => x.data.index === this.state.highlightedIndex,
          id: 'lines',
        },
      ],
      colorBy: 'label',
      layout: 'vertical',
      borderColor: 'inherit:darker(1.6)',
      axisTop: null,
      axisRight: null,
      axisBottom: {
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 8,
        tickRotation: 0,
        legend: axisBottomLegend,
        legendPosition: 'middle',
        legendOffset: bottomLegendOffset,
        tickValues: tickInterval,
        format: axisBottomFormat,
        theme: defaultTheme,
        renderTick: () => <></>,
      },
      axisLeft: {
        legend: axisLeftLegend,
        legendPosition: 'middle',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: leftLegendOffset,
        renderTick: this.renderAxisLeftTick,
        format: axisLeftFormat,
        theme: defaultTheme,
      },
      enableGridX: false,
      gridXValues: undefined,
      maxValue: tickInterval ? undefined : 'auto',
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
      tooltip: (props) => <Tooltip {...props} formatter={tooltipFormatter} />,
    };

    // see https://github.com/plouc/nivo/issues/164#issuecomment-488939712
    return (
      <div className={verticalBarWrapper}>
        {legends && <Legend legends={legends} theme={defaultTheme.legend} />}
        <TextBugWrapper>
          <div style={{ height }}>
            <ResponsiveBar {...chartData} height={height} />
          </div>
        </TextBugWrapper>
      </div>
    );
  }
}

VerticalBar.propTypes = {
  maxValue: PropTypes.number,
  tickValues: PropTypes.arrayOf(PropTypes.number),
  data: PropTypes.array,
  keys: PropTypes.arrayOf(PropTypes.string),
  colors: PropTypes.arrayOf(PropTypes.string),
  sortBy: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
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
  tickInterval: PropTypes.number,
  showCursor: PropTypes.bool,
  onClick: PropTypes.func,
  xTickTextLength: PropTypes.number,
  leftLegendOffset: PropTypes.number,
  bottomLegendOffset: PropTypes.number,
  indexBy: PropTypes.string,
  height: PropTypes.number.isRequired,
  axisLeftLegend: PropTypes.string,
  axisBottomLegend: PropTypes.string,
  padding: PropTypes.number,
  tooltipFormatter: PropTypes.any,
  legends: PropTypes.array,
};

export default VerticalBar;
