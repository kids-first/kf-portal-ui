import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { get } from 'lodash';
import gql from 'graphql-tag';
import VerticalBar from 'chartkit/components/VerticalBar';
import { CohortCard } from './ui';

const ageAtDiagnosisTooltip = data => {
  return `${data.value.toLocaleString()} Participant${data.value > 1 ? 's' : ''}`;
};

const AgeDiagChart = ({ data, theme, isLoading: isParentLoading }) => (
  <CohortCard title="Age at Diagnosis" loading={isParentLoading}>
    <VerticalBar
      showCursor={false}
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
  variables: { sqon },
  query: gql`
    # embeds additional filter on the provided sqon to create the ranges.
    # diagnoses.age_at_event_days values are indays, converted from year
    query($sqon: JSON) {
      participant {
        _0to1: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: "<=", content: { field: "diagnoses.age_at_event_days", value: [364] } }
            ]
          }
        ) {
          total
        }
        _1to5: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [365, 1824] }
              }
            ]
          }
        ) {
          total
        }
        _5to10: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              {
                op: "between"
                content: { field: "diagnoses.age_at_event_days", value: [1825, 3649] }
              }
            ]
          }
        ) {
          total
        }
        _10to15: hits(
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
          total
        }
        _15to18: hits(
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
          total
        }
        _18plus: hits(
          filters: {
            op: "and"
            content: [
              $sqon
              { op: ">=", content: { field: "diagnoses.age_at_event_days", value: [6570] } }
            ]
          }
        ) {
          total
        }
      }
    }
  `,
  transform: ({ data }) => [
    { id: 'aggNewborn', label: 'Newborn', value: get(data, 'participant._0to1.total', 0) },
    { id: 'agg5to10', label: '1 - 5', value: get(data, 'participant._1to5.total', 0) },
    { id: 'agg5to10', label: '5 - 10', value: get(data, 'participant._5to10.total', 0) },
    { id: 'agg10to15', label: '10 - 15', value: get(data, 'participant._10to15.total', 0) },
    { id: 'agg15to18', label: '15 - 18', value: get(data, 'participant._15to18.total', 0) },
    { id: 'aggAdult', label: 'Adult', value: get(data, 'participant._18plus.total', 0) },
  ],
});

export default compose(withTheme)(AgeDiagChart);
