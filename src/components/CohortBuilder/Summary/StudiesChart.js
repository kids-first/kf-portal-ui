import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { get, size } from 'lodash';
import gql from 'graphql-tag';
import { withApi } from 'services/api';
import LoadingSpinner from 'uikit/LoadingSpinner';
import QueriesResolver from '../QueriesResolver';

const studiesToolTip = data => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands.toLocaleString()} Probands`}</div>
      <div>{`${familyMembers.toLocaleString()} Family Members`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`}</div>
    </div>
  );
};

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const toSingleStudyQueries = ({ studies, sqon }) =>
  studies.map(studyName => ({
    query: gql`
        query($sqon: JSON) {
          participant {
            familyMembers: aggregations(
              aggregations_filter_themselves: true
              filters: {
                op: "and"
                content: [
                  $sqon
                  { op: "in", content: { field: "study.short_name", value: ["${studyName}"] } }
                  { op: "in", content: { field: "is_proband", value: ["false"] } }
                ]
              }
            ) {
              study__short_name {
                buckets {
                  key
                }
              }
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
                  { op: "in", content: { field: "study.short_name", value: ["${studyName}"] } }
                  { op: "in", content: { field: "is_proband", value: ["true"] } }
                ]
              }
            ) {
              study__short_name {
                buckets {
                  key
                }
              }
              kf_id {
                buckets {
                  key
                }
              }
            }
          }
        }
      `,

    variables: { sqon },

    transform: data => {
      const label = get(
        data,
        'data.participant.familyMembers.study__short_name.buckets[0].key',
        '',
      );
      const familyMembers = size(get(data, 'data.participant.familyMembers.kf_id.buckets'));
      const probands = size(get(data, 'data.participant.proband.kf_id.buckets'));
      const studyData = {
        label,
        familyMembers,
        probands,
      };
      return studyData;
    },
  }));

const defaultSqon = {
  op: 'and',
  content: [],
};

const StudiesChart = ({ studies, sqon = defaultSqon, theme, api }) => (
  <QueriesResolver api={api} queries={toSingleStudyQueries({ studies, sqon: defaultSqon })}>
    {({ isLoading, data }) => {
      console.log('isLoading', isLoading, 'data', data);
      return isLoading ? (
        <LoadingSpinner color={theme.greyScale11} size={'50px'} />
      ) : !data ? (
        <div>No data</div>
      ) : (
        <HorizontalBar
          data={data.filter(d => d.label).map((d, i) => ({ ...d, id: i }))}
          indexBy="label"
          keys={['probands', 'familyMembers']}
          tooltipFormatter={studiesToolTip}
          sortBy={sortDescParticipant}
          tickInterval={4}
          colors={[theme.chartColors.blue, theme.chartColors.purple]}
          xTickTextLength={28}
          legends={[
            { title: 'Probands', color: theme.chartColors.blue },
            { title: 'Family Members', color: theme.chartColors.purple },
          ]}
          padding={0.5}
        />
      );
    }}
  </QueriesResolver>
);

export const studiesQuery = sqon => ({
  query: gql`
    query {
      participant {
        aggregations {
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

export default compose(
  withTheme,
  withApi,
)(StudiesChart);
