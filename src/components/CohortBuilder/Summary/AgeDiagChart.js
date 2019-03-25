import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { get, sumBy } from 'lodash';
import gql from 'graphql-tag';
import VerticalBar from 'chartkit/components/VerticalBar';
import { CohortCard } from './ui';

const ageAtDiagnosisTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

const AgeDiagChart = ({ data, theme, isLoading: isParentLoading }) => (
  <CohortCard title="Age at Diagnosis" loading={isParentLoading}>
    <VerticalBar
      data={data}
      indexBy="label"
      tooltipFormatter={ageAtDiagnosisTooltip}
      sortByValue={true}
      height={225}
      colors={[theme.chartColors.lightblue]}
    />
  </CohortCard>
);

export const ageDiagQuery = sqon => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              buckets {
                doc_count
                key
              }
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: data => {
    const buckets = get(
      data,
      'data.participant.aggregations.diagnoses__age_at_event_days.histogram.buckets',
    );

    // Intervals are in years returned as ordered array

    const sum = buckets => sumBy(buckets, 'doc_count');

    // Newborn
    const aggNewborn = sum(buckets.slice(0, 1));

    // 1 - 5 Years
    const agg1to5 = sum(buckets.slice(1, 6));

    // 5 - 10 Years
    const agg5to10 = sum(buckets.slice(6, 11));

    // 10 - 15 Years
    const agg10to15 = sum(buckets.slice(11, 16));

    // 15 - 18 Years
    const agg15to18 = sum(buckets.slice(16, 19));

    // Adult
    const aggAdult = sum(buckets.slice(19));

    return [
      { id: 'aggNewborn', label: 'Newborn', value: aggNewborn },
      { id: 'agg5to10', label: '1 - 5', value: agg1to5 },
      { id: 'agg5to10', label: '5 - 10', value: agg5to10 },
      { id: 'agg10to15', label: '10 - 15', value: agg10to15 },
      { id: 'agg15to18', label: '15 - 18', value: agg15to18 },
      { id: 'aggAdult', label: 'Adult', value: aggAdult },
    ];
  },
});

export default compose(withTheme)(AgeDiagChart);
