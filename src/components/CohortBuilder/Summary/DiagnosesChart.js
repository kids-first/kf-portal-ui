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
import { mergeSqonAtIndex } from '../../../common/sqonUtils';

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
                {
                  op: "in"
                  content: { field: "diagnoses.mondo_id_diagnosis", value: [$diagnosis] }
                }
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

const formatedField = value => {
  switch (value) {
    case 'Ewing Sarcoma MONDO 0012817':
      return 'Ewing sarcoma (MONDO:0012817)';
    case 'Neuroblastoma MONDO 0005072':
      return 'neuroblastoma (MONDO:0005072)';
    case 'Low Grade Glioma MONDO 0021637':
      return 'low grade glioma (MONDO:0021637)';
    case 'Cleft Lip Palate MONDO 0016044':
      return 'cleft lip/palate (MONDO:0016044)';
    case 'Medulloblastoma MONDO 0007959':
      return 'medulloblastoma (MONDO:0007959)';
    case 'Cleft Lip Disease MONDO 0004747':
      return 'cleft lip (disease) (MONDO:0004747)';
    case 'Grade III Glioma MONDO 0021640':
      return 'grade III glioma (MONDO:0021640)';
    case 'Cleft Palate MONDO 0016064':
      return 'cleft palate (MONDO:0016064)';
    case 'Ependymoma MONDO 0016698':
      return 'ependymoma (MONDO:0016698)';
    case 'Sex Differentiation Disease MONDO 0002145':
      return 'sex differentiation disease (MONDO:0002145)';
    default:
      return null;
  }
};

// const DiagnosesChart = ({ topDiagnoses, sqon, theme, api, isLoading: isParentLoading }) => (
class DiagnosesChart extends React.Component {
  addSqon = (field, value) => {
    const { virtualStudy, setSqons } = this.props;

    const newSqon = {
      op: 'in',
      content: {
        field: field,
        value: [value],
      },
    };

    const modifiedSqons = mergeSqonAtIndex(newSqon, virtualStudy.sqons, virtualStudy.activeIndex);
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
          <CohortCard title="Most Frequent Diagnoses" loading={isLoading || isParentLoading}>
            {!data ? (
              <div>No data</div>
            ) : (
              <BarChartContainer>
                <HorizontalBar
                  showCursor={true}
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
                  onClick={data => {
                    this.addSqon('diagnoses.mondo_id_diagnosis', formatedField(data.indexValue));
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
// );

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
      .take(10)
      .map(diag => diag.key)
      .value();
  },
});

const mapStateToProps = state => ({
  virtualStudy: state.cohortBuilder,
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
