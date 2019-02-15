import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { get, inRange } from 'lodash';
import gql from 'graphql-tag';
import VerticalBar from 'chartkit/components/VerticalBar';

const ageAtDiagnosisTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

const AgeDiagChart = ({ data, theme }) => (
  <VerticalBar
    data={data}
    indexBy="label"
    tooltipFormatter={ageAtDiagnosisTooltip}
    sortByValue={true}
    height={225}
    colors={[theme.chartColors.lightblue]}
  />
);

export const ageDiagQuery = sqon => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon) {
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

    // NB: intervals are in days
    const reducer = (prev, current) => prev + current.doc_count;

    // Newborn
    const aggNewborn = buckets.filter(b => inRange(Number(b.key), 0, 365)).reduce(reducer, 0);

    // 1 - 5 Years
    const fiveYears = 365 * 5 + 1;
    const agg1to5 = buckets.filter(b => inRange(Number(b.key), 365, fiveYears)).reduce(reducer, 0);

    // 5 - 10 Years
    const tenYears = 365 * 10 + 1;
    const agg5to10 = buckets
      .filter(b => inRange(Number(b.key), fiveYears, tenYears))
      .reduce(reducer, 0);

    // 10 - 15 Years
    const fifteenYears = 365 * 15 + 1;
    const agg10to15 = buckets
      .filter(b => inRange(Number(b.key), tenYears, fifteenYears))
      .reduce(reducer, 0);

    // 15 - 18 Years
    const eighteenYears = 365 * 18 + 1;
    const agg15to18 = buckets
      .filter(b => inRange(Number(b.key), fifteenYears, eighteenYears))
      .reduce(reducer, 0);

    // Adult
    const aggAdult = buckets.filter(b => inRange(Number(b.key), eighteenYears)).reduce(reducer, 0);

    return [
      {
        id: 'aggNewborn',
        label: 'Newborn',
        value: aggNewborn,
      },

      {
        id: 'agg5to10',
        label: '1 - 5',
        value: agg1to5,
      },
      {
        id: 'agg5to10',
        label: '5 - 10',
        value: agg5to10,
      },
      {
        id: 'agg10to15',
        label: '10 - 15',
        value: agg10to15,
      },
      {
        id: 'agg15to18',
        label: '15 - 18',
        value: agg15to18,
      },
      {
        id: 'aggAdult',
        label: 'Adult',
        value: aggAdult,
      },
    ];
  },
});

export default compose(withTheme)(AgeDiagChart);
