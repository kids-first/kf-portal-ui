import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { get, size } from 'lodash';
import gql from 'graphql-tag';
import styled from 'react-emotion';

import { withApi } from 'services/api';
import LoadingSpinner from 'uikit/LoadingSpinner';
import QueriesResolver from '../QueriesResolver';
import { CohortCard, BarChartContainer } from './ui';

const studiesToolTip = data => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands.toLocaleString()} Proband${participants !== 1 ? 's' : ''}`}</div>
      <div>{`${familyMembers.toLocaleString()} Family Member${participants !== 1 ? 's' : ''}`}</div>
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
        query($sqon: JSON) {
          participant {
            familyMembers: aggregations(
              aggregations_filter_themselves: true
              filters: {
                op: "and"
                content: [
                  $sqon
                  { op: "in", content: { field: "study.short_name", value: ["${studyShortName}"] } }
                  { op: "in", content: { field: "is_proband", value: ["false"] } }
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
                  { op: "in", content: { field: "study.short_name", value: ["${studyShortName}"] } }
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
    variables: { sqon },
    transform: data => ({
      label: studyShortName,
      familyMembers: size(get(data, 'data.participant.familyMembers.kf_id.buckets')),
      probands: size(get(data, 'data.participant.proband.kf_id.buckets')),
    }),
  }));

const StudiesChart = ({ studies, sqon, theme, api }) => (
  <QueriesResolver api={api} queries={toSingleStudyQueries({ studies, sqon })}>
    {({ isLoading, data }) => (
      <CohortCard title="Studies" badge={data ? data.length : null}>
        {isLoading ? (
          <LoadingSpinner color={theme.greyScale11} size={'50px'} />
        ) : !data ? (
          <div>No data</div>
        ) : (
          <BarChartContainer>
            <HorizontalBar
              data={data.map((d, i) => ({ ...d, id: i }))}
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
          </BarChartContainer>
        )}
      </CohortCard>
    )}
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
