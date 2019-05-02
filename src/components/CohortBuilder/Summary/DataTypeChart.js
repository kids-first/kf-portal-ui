import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import gql from 'graphql-tag';
import VerticalBar from 'chartkit/components/VerticalBar';
import _ from 'lodash';

const dataTypeTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

const DataTypeChart = ({ data, theme, indexBy, axisLeftLegend, axisBottomLegend, tooltipFormatter}) => (
    <VerticalBar
      showCursor={false}
      indexBy={indexBy || 'label'}
      tooltipFormatter={tooltipFormatter || dataTypeTooltip}
      sortByValue={true}
      height={260}
      bottomLegendOffset={20}
      data={_(data)
        .sortBy(d => d.value)
        .map((d, i) => ({ ...d, id: i }))
        .reverse()
        .value()}

      axisLeftLegend={axisLeftLegend}
      axisBottomLegend={axisBottomLegend}
      axisBottomFormat={() => {}}
      colors={[theme.chartColors.lightblue]}
    />
);

const toChartData = ({ key, doc_count }) => {
  const dataKey = key === '__missing__' ? 'No Data' : key;
  return {
    id: dataKey,
    label: dataKey,
    value: doc_count,
  };
};

export const dataTypesQuery = sqon => ({
  query: gql`
    query ($sqon: JSON) {
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
    }
  `,
  variables: { sqon },
  transform: data => {
    return get(data, 'data.participant.aggregations.files__data_type.buckets', []).map(toChartData)
  },
});

export const experimentalStrategyQuery = sqon => ({
  query: gql`
    query ($sqon: JSON) {
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
  transform: data => {
    return get(data, 'data.participant.aggregations.files__sequencing_experiments__experiment_strategy.buckets', []).map(toChartData)
  },
});

export default compose(withTheme)(DataTypeChart);
