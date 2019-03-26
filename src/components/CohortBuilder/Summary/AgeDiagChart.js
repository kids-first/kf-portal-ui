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
    fragment bucketsAgg on Aggregations {
      buckets {
        key
        doc_count
      }
    }
    query($sqon: JSON) {
      participant {
        # embeds additional filter on the provided sqon to create the ranges.
        # diagnoses.age_at_event_days values are indays, converted from year
        _0to1: aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [
              $sqon
              { op: "<=", content: { field: "diagnoses.age_at_event_days", value: [364] } }
            ]
          }
        ) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              ...bucketsAgg
            }
          }
        }
        _1to5: aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [365, 1094] }
              }
            ]
          }
        ) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              ...bucketsAgg
            }
          }
        }
        _5to10: aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [1095, 3649] }
              }
            ]
          }
        ) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              ...bucketsAgg
            }
          }
        }
        _10to15: aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [3650, 5474] }
              }
            ]
          }
        ) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              ...bucketsAgg
            }
          }
        }
        _15to18: aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [5475, 6569] }
              }
            ]
          }
        ) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              ...bucketsAgg
            }
          }
        }
        _18plus: aggregations(
          aggregations_filter_themselves: true
          filters: {
            op: "and"
            content: [
              $sqon
              { op: ">=", content: { field: "diagnoses.age_at_event_days", value: [6570] } }
            ]
          }
        ) {
          diagnoses__age_at_event_days {
            histogram(interval: 365) {
              ...bucketsAgg
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: ({ data }) => {
    const getTotalDocCount = agg =>
      sumBy(get(agg, 'diagnoses__age_at_event_days.histogram.buckets'), 'doc_count');

    return [
      { id: 'aggNewborn', label: 'Newborn', value: getTotalDocCount(data.participant._0to1) },
      { id: 'agg5to10', label: '1 - 5', value: getTotalDocCount(data.participant._1to5) },
      { id: 'agg5to10', label: '5 - 10', value: getTotalDocCount(data.participant._5to10) },
      { id: 'agg10to15', label: '10 - 15', value: getTotalDocCount(data.participant._10to15) },
      { id: 'agg15to18', label: '15 - 18', value: getTotalDocCount(data.participant._15to18) },
      { id: 'aggAdult', label: 'Adult', value: getTotalDocCount(data.participant._18plus) },
    ];
  },
});

export default compose(withTheme)(AgeDiagChart);
