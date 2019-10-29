import React from 'react';
import { withTheme } from 'emotion-theming';
import { compose } from 'recompose';
import { BarChartContainer, CohortCard, getCohortBarColors } from './ui';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import gql from 'graphql-tag';
import _, { get, startCase } from 'lodash';
import QueriesResolver from '../QueriesResolver';
import { withApi } from 'services/api';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { connect } from 'react-redux';
import {
  setSqonValueAtIndex,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
} from '../../../common/sqonUtils';

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
                {
                  op: "in"
                  content: { field: "diagnoses.mondo_id_diagnosis", value: [$diagnosis] }
                }
                { op: "in", content: { field: "is_proband", value: ["false", "__missing__"] } }
              ]
            }
          ) {
            diagnoses__mondo_id_diagnosis {
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
                {
                  op: "in"
                  content: { field: "diagnoses.mondo_id_diagnosis", value: [$diagnosis] }
                }
                { op: "in", content: { field: "is_proband", value: ["true"] } }
              ]
            }
          ) {
            diagnoses__mondo_id_diagnosis {
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
      diagnosisValue: diagnosis,
      label: startCase(diagnosis),
      familyMembers: get(
        data,
        'data.participant.familyMembers.diagnoses__mondo_id_diagnosis.buckets[0].doc_count',
        0,
      ),
      probands: get(
        data,
        'data.participant.proband.diagnoses__mondo_id_diagnosis.buckets[0].doc_count',
        0,
      ),
    }),
  }));

class DiagnosesChart extends React.Component {
  addSqon = (field, value) => {
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
        values: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
        operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR,
      },
    );
    setSqons(modifiedSqons);
  };

  render() {
    const { topDiagnoses, sqon, theme, api, isLoading: isParentLoading } = this.props;
    return (
      <QueriesResolver
        name="GQL_DIAGNOSIS_CHART"
        api={api}
        queries={toSingleDiagQueries({ topDiagnoses, sqon })}
      >
        {({ isLoading, data }) => (
          <CohortCard
            title="Most Frequent Diagnoses (Mondo)"
            loading={isLoading || isParentLoading}
          >
            {!data ? (
              <div>No data</div>
            ) : (
              <BarChartContainer>
                <HorizontalBar
                  showCursor={true}
                  data={data}
                  indexBy="label"
                  keys={['probands', 'familyMembers']}
                  sortByKeys={['probands', 'familyMembers']}
                  sortOrder={'desc'}
                  tooltipFormatter={mostFrequentDiagnosisTooltip}
                  tickInterval={4}
                  colors={getCohortBarColors(data, theme)}
                  xTickTextLength={28}
                  legends={[
                    { title: 'Probands', color: theme.chartColors.blue },
                    { title: 'Other Participants', color: theme.chartColors.purple },
                  ]}
                  onClick={data => {
                    this.addSqon('diagnoses.mondo_id_diagnosis', data.data.diagnosisValue);
                  }}
                  axisLeftFormat={value => {
                    return value.indexOf('MONDO') > -1
                      ? value.substr(0, value.indexOf('MONDO'))
                      : value;
                  }}
                />
              </BarChartContainer>
            )}
          </CohortCard>
        )}
      </QueriesResolver>
    );
  }
}

/**
 * Get the top 10 diagnoses overall
 * Then get the proband/family member breakdown
 */
export const diagnosesQuery = sqon => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          diagnoses__mondo_id_diagnosis {
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
    const buckets = get(
      data,
      'data.participant.aggregations.diagnoses__mondo_id_diagnosis.buckets',
    );
    return _(buckets)
      .orderBy(bucket => bucket.doc_count, 'desc')
      .map(diag => diag.key)
      .difference(['No Match', '__missing__'])
      .take(10)
      .value();
  },
});

const mapStateToProps = state => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default compose(
  withApi,
  withTheme,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(DiagnosesChart);
