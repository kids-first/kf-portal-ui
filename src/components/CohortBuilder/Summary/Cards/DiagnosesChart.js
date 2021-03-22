import React from 'react';
import gql from 'graphql-tag';
import get from 'lodash/get';
import { connect } from 'react-redux';

import theme from 'theme/defaultTheme';
import { getCohortBarColors } from '../ui';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import QueriesResolver from '../../QueriesResolver';
import { setSqons } from 'store/actionCreators/virtualStudies';
import {
  setSqonValueAtIndex,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
} from 'common/sqonUtils';
import Card from '@ferlab/ui/core/view/GridCard';
import PropTypes from 'prop-types';
import { mostFrequentDiagnosisTooltip, removeMondo } from 'components/Charts';
import Empty, { SIZE } from 'components/UI/Empty';

const toSingleDiagQueries = ({ topDiagnoses, sqon }) =>
  topDiagnoses.map((diagnosis) => ({
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
    transform: (data) => ({
      diagnosisValue: diagnosis,
      label: diagnosis,
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

/**
 * Get the top 10 diagnoses overall
 * Then get the proband/family member breakdown
 */
export const diagnosesQuery = (sqon) => ({
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
  transform: (data) => {
    const buckets = get(
      data,
      'data.participant.aggregations.diagnoses__mondo_id_diagnosis.buckets',
    );

    return buckets
      .filter((bucket) => !['No Match', '__missing__'].includes(bucket.key))
      .sort((a, b) => b.doc_count - a.doc_count)
      .slice(0, 10)
      .map((bucket) => bucket.key);
  },
});

class DiagnosesChart extends React.Component {
  static propTypes = {
    setSqons: PropTypes.func,
    virtualStudy: PropTypes.object,
    sqon: PropTypes.object,
    api: PropTypes.func,
    isLoading: PropTypes.bool,
    topDiagnoses: PropTypes.array,
  };

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
    const { topDiagnoses, sqon, api, isLoading: isParentLoading } = this.props;
    return (
      <QueriesResolver
        name="GQL_DIAGNOSIS_CHART"
        api={api}
        queries={toSingleDiagQueries({ topDiagnoses, sqon })}
      >
        {({ isLoading, data }) => (
          <Card
            title={<span className={'title-summary-card'}>Most Frequent Diagnoses (Mondo)</span>}
            loading={isLoading || isParentLoading}
          >
            {!data || data.length === 0 ? (
              <div className={'empty-graph'}>
                <Empty size={SIZE.SMALL} />
              </div>
            ) : (
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
                onClick={(data) => {
                  this.addSqon('diagnoses.mondo_id_diagnosis', data.data.diagnosisValue);
                }}
                axisLeftFormat={removeMondo}
              />
            )}
          </Card>
        )}
      </QueriesResolver>
    );
  }
}

const mapStateToProps = (state) => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosesChart);
