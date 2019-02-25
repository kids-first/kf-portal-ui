import React from 'react';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { BarChartContainer, CardSlot } from './index';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import gql from 'graphql-tag';
import _, { take, get, startCase } from 'lodash';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import LoadingSpinner from 'uikit/LoadingSpinner';

const mostFrequentDiagnosisTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const toSingleDiagQueries = ({ topDiagnoses, sqon }) =>
  topDiagnoses.map(diagnosis => ({
    query: gql`query ($sqon: JSON) {
      participant {
        familyMembers: aggregations(aggregations_filter_themselves: true, filters: {op: "and", content: [$sqon, {op: "in", content: {field: "diagnoses.diagnosis", value: ["${diagnosis}"]}}, {op: "in", content: {field: "is_proband", value: ["false"]}}]}) {
          diagnoses__diagnosis {
            buckets {
              doc_count
              key
            }
          }
        }
        proband: aggregations(aggregations_filter_themselves: true, filters: {op: "and", content: [$sqon, {op: "in", content: {field: "diagnoses.diagnosis", value: ["${diagnosis}"]}}, {op: "in", content: {field: "is_proband", value: ["true"]}}]}) {
          diagnoses__diagnosis {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
    `,
    variables: { sqon },
    transform: data => ({
      label: startCase(diagnosis),
      probands: get(
        data,
        'data.participant.familyMembers.diagnoses__diagnosis.buckets[0].doc_count',
        0,
      ),
      familyMembers: get(
        data,
        'data.participant.proband.diagnoses__diagnosis.buckets[0].doc_count',
        0,
      ),
    }),
  }));

const DiagnosesChart = ({ topDiagnoses, sqon, theme, api }) => (
  <QueriesResolver api={api} queries={toSingleDiagQueries({ topDiagnoses, sqon })}>
    {({ isLoading, data }) => (
      <CardSlot title="Most Frequent Diagnoses">
        {isLoading ? (
          <LoadingSpinner color={theme.greyScale11} size={'50px'} />
        ) : !data ? (
          <div>No data</div>
        ) : (
          <BarChartContainer>
            <HorizontalBar
              data={_(data)
                .sortBy(d => d.probands + d.familyMembers)
                .map((d, i) => ({ ...d, id: i }))
                .value()}
              indexBy="label"
              keys={['probands', 'familyMembers']}
              tooltipFormatter={mostFrequentDiagnosisTooltip}
              tickInterval={4}
              colors={[theme.chartColors.blue, theme.chartColors.purple]}
              xTickTextLength={28}
              legends={[
                { title: 'Probands', color: theme.chartColors.blue },
                { title: 'Family Members', color: theme.chartColors.purple },
              ]}
            />
          </BarChartContainer>
        )}
      </CardSlot>
    )}
  </QueriesResolver>
);

/**
 * Get the top 10 diagnoses overall
 * Then get the proband/family member breakdown
 */
export const diagnosesQuery = sqon => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon) {
          diagnoses__diagnosis {
            buckets {
              doc_count
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: data => {
    const buckets = get(data, 'data.participant.aggregations.diagnoses__diagnosis.buckets');
    return take(buckets, 10).map(diag => diag.key);
  },
});

export default compose(
  withApi,
  withTheme,
)(DiagnosesChart);
