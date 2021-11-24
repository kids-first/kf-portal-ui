import React from 'react';
import { connect } from 'react-redux';
import VerticalBar from 'chartkit/components/VerticalBar';
import gql from 'graphql-tag';
import get from 'lodash/get';
import PropTypes from 'prop-types';

import {
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
  setSqonValueAtIndex,
} from 'common/sqonUtils';
import { setSqons } from 'store/actionCreators/virtualStudies';
import theme from 'theme/defaultTheme';

const dataTypeTooltip = (data) =>
  `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;

class DataTypeChart extends React.Component {
  static propTypes = {
    setSqons: PropTypes.func.isRequired,
    virtualStudy: PropTypes.object,
    height: PropTypes.number,
    data: PropTypes.arrayOf(PropTypes.object),
    axisBottomLegend: PropTypes.string,
    axisLeftLegend: PropTypes.string,
    indexBy: PropTypes.string,
  };

  addSqon(field, value) {
    const { virtualStudy, setSqons } = this.props;

    const newSqon = {
      op: 'in',
      content: {
        field,
        value: [value],
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      virtualStudy.sqons,
      virtualStudy.activeIndex,
      newSqon,
      {
        operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
        values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
      },
    );
    setSqons(modifiedSqons);
  }

  render() {
    const { data, indexBy, axisLeftLegend, axisBottomLegend, height = 260 } = this.props;

    // Get the minimum value (5% of the max) for any vertical bar's height
    const minValue =
      data.reduce((acc, val) => {
        if (acc > val.value) return acc;
        else return val.value;
      }, 0) * 0.05;

    // Then, clean the data by changing the value to the min if applicable. Keep old (correct) value in preciseValue
    const normalizedData = data.map((item) => {
      if (item.value <= minValue) {
        item.preciseValue = item.value;
        item.value = minValue;
      } else {
        item.preciseValue = item.value;
      }

      return item;
    });

    // Finally, the tooltip has to reflect the correct value, so use preciseValue instead of value
    const tooltipFormatter = (data) =>
      `${data.label.toLocaleString()}: ${data.preciseValue.toLocaleString()} Participants`;

    return (
      <VerticalBar
        showCursor={true}
        indexBy={indexBy || 'label'}
        tooltipFormatter={tooltipFormatter || dataTypeTooltip}
        keys={['value']}
        height={height}
        bottomLegendOffset={20}
        leftLegendOffset={-42}
        sortByKeys={['value']}
        sortOrder={'desc'}
        data={normalizedData}
        axisLeftLegend={axisLeftLegend}
        axisBottomLegend={axisBottomLegend}
        axisBottomFormat={() => {}}
        colors={[theme.chartColors.lightblue]}
        onClick={(data) => {
          this.addSqon(
            axisBottomLegend === 'Data Type'
              ? 'available_data_types'
              : 'files.sequencing_experiments.experiment_strategy',
            data.data.label,
          );
        }}
      />
    );
  }
}

const toChartData = ({ key, doc_count }) => {
  const dataKey = key === '__missing__' ? 'No Data' : key;
  return {
    id: dataKey,
    label: dataKey,
    value: doc_count,
  };
};

export const dataTypesQuery = (sqon) => ({
  query: `query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          files__data_type {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }`,
  variables: { sqon },
  transform: (data) =>
    get(data, 'data.participant.aggregations.files__data_type.buckets', []).map(toChartData),
});

export const experimentalStrategyQuery = (sqon) => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          files__sequencing_experiments__experiment_strategy {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: (data) =>
    get(
      data,
      'data.participant.aggregations.files__sequencing_experiments__experiment_strategy.buckets',
      [],
    ).map(toChartData),
});

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataTypeChart);
