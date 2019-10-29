import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { get, size } from 'lodash';
import gql from 'graphql-tag';
import { withApi } from 'services/api';
import QueriesResolver from '../QueriesResolver';
import { CohortCard, BarChartContainer, getCohortBarColors } from './ui';
import { setSqons } from 'store/actionCreators/virtualStudies';
import { connect } from 'react-redux';
import { setSqonValueAtIndex, MERGE_OPERATOR_STRATEGIES } from '../../../common/sqonUtils';

const studiesToolTip = data => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands.toLocaleString()} Proband${probands !== 1 ? 's' : ''}`}</div>
      <div>{`${familyMembers.toLocaleString()} Other Participant${
        familyMembers > 1 ? 's' : ''
      }`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants !== 1 ? 's' : ''}`}</div>
    </div>
  );
};

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal - bTotal;
};

const toSingleStudyQueries = ({ studies, sqon }) =>
  studies.map(studyShortName => ({
    query: gql`
      query($sqon: JSON, $studyShortName: String) {
        participant {
          familyMembers: aggregations(
            aggregations_filter_themselves: true
            filters: {
              op: "and"
              content: [
                $sqon
                { op: "in", content: { field: "study.short_name", value: [$studyShortName] } }
                { op: "in", content: { field: "is_proband", value: ["false", "__missing__"] } }
              ]
            }
          ) {
            kf_id {
              buckets {
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
                { op: "in", content: { field: "study.short_name", value: [$studyShortName] } }
                { op: "in", content: { field: "is_proband", value: ["true"] } }
              ]
            }
          ) {
            kf_id {
              buckets {
                key
              }
            }
          }
        }
      }
    `,
    variables: { sqon, studyShortName },
    transform: data => ({
      label: studyShortName,
      familyMembers: size(get(data, 'data.participant.familyMembers.kf_id.buckets')),
      probands: size(get(data, 'data.participant.proband.kf_id.buckets')),
    }),
  }));

class StudiesChart extends React.Component {
  addSqon = (field, value) => {
    const { virtualStudy, setSqons } = this.props;

    const newSqon = {
      op: 'in',
      content: {
        field: field,
        value: [value],
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      virtualStudy.sqons,
      virtualStudy.activeIndex,
      newSqon,
      { operator: MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR },
    );
    setSqons(modifiedSqons);
  };

  render() {
    const { studies, sqon, theme, api, isLoading: isParentLoading } = this.props;
    return (
      <QueriesResolver
        name="GQL_STUDIES_CHART"
        api={api}
        queries={toSingleStudyQueries({ studies, sqon })}
      >
        {({ isLoading, data }) => (
          <CohortCard
            title="Studies"
            badge={data && !isLoading ? data.length : null}
            loading={isLoading || isParentLoading}
          >
            {!data ? (
              <div>No data</div>
            ) : (
              <BarChartContainer>
                <HorizontalBar
                  showCursor={true}
                  data={data.map((d, i) => ({ ...d, id: i }))}
                  indexBy="label"
                  keys={['probands', 'familyMembers']}
                  tooltipFormatter={studiesToolTip}
                  sortBy={sortDescParticipant}
                  tickInterval={4}
                  colors={getCohortBarColors(data, theme)}
                  xTickTextLength={28}
                  legends={[
                    { title: 'Probands', color: theme.chartColors.blue },
                    { title: 'Other Participants', color: theme.chartColors.purple },
                  ]}
                  padding={0.5}
                  onClick={data => {
                    this.addSqon('study.short_name', data.indexValue);
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

export const studiesQuery = sqon => ({
  query: gql`
    query($sqon: JSON) {
      participant {
        aggregations(filters: $sqon, aggregations_filter_themselves: true) {
          study__short_name {
            buckets {
              key
            }
          }
        }
      }
    }
  `,
  variables: { sqon },
  transform: data =>
    get(data, 'data.participant.aggregations.study__short_name.buckets', []).map(
      study => study.key,
    ),
});

const mapStateToProps = state => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export default compose(
  withTheme,
  withApi,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(StudiesChart);
