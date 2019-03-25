import React from 'react';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { BarChartContainer, CohortCard, getCohortBarColors } from './ui';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import gql from 'graphql-tag';
import _, { get, startCase } from 'lodash';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';

const mostFrequentDiagnosisTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const toSingleDiagQueries = ({ topDiagnoses, sqon }) =>
  topDiagnoses.map(diagnosis => ({
    query: gql`
      query($sqon: JSON, $diagnosis: String) {
        participant {
          familyMembers: aggregations(
            aggregations_filter_themselves: true
            filters: {
              op: "and"
              content: [
                $sqon
                { op: "in", content: { field: "diagnoses.diagnosis", value: [$diagnosis] } }
                { op: "in", content: { field: "is_proband", value: ["false", "__missing__"] } }
              ]
            }
          ) {
            diagnoses__diagnosis {
              buckets {
                doc_count
                key
              }
            }
          }
          proband: aggregations(
            aggregations_filter_themselves: true
            filters: {
              op: "and"
              content: [
                $sqon
                { op: "in", content: { field: "diagnoses.diagnosis", value: [$diagnosis] } }
                { op: "in", content: { field: "is_proband", value: ["true"] } }
              ]
            }
          ) {
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
    variables: { sqon, diagnosis },
    transform: data => ({
      label: startCase(diagnosis),
      familyMembers: get(
        data,
        'data.participant.familyMembers.diagnoses__diagnosis.buckets[0].doc_count',
        0,
      ),
      probands: get(data, 'data.participant.proband.diagnoses__diagnosis.buckets[0].doc_count', 0),
    }),
  }));

const DiagnosesChart = ({ topDiagnoses, sqon, theme, api, isLoading: isParentLoading }) => (
  <QueriesResolver
    name="GQL_DIAGNOSIS_CHART"
    api={api}
    queries={toSingleDiagQueries({ topDiagnoses, sqon })}
  >
    {({ isLoading, data }) => (
      <CohortCard title="Most Frequent Diagnoses" loading={isLoading || isParentLoading}>
        {!data ? (
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
              colors={getCohortBarColors(data, theme)}
              xTickTextLength={28}
              legends={[
                { title: 'Probands', color: theme.chartColors.blue },
                { title: 'Other Participants', color: theme.chartColors.purple },
              ]}
            />
          </BarChartContainer>
        )}
      </CohortCard>
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
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
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
    return _(buckets)
      .orderBy(bucket => bucket.doc_count, 'desc')
      .take(10)
      .map(diag => diag.key)
      .value();
  },
});

export default compose(
  withApi,
  withTheme,
)(DiagnosesChart);
