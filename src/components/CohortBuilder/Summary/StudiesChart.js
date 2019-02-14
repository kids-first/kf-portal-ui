import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { get } from 'lodash';

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

const StudiesChart = ({ data, theme }) => (
  <HorizontalBar
    data={data}
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

export const studiesQuery = sqon => ({
  query: `query ($sqon: JSON) {
    participant {
      aggregations(filters: $sqon) {
        study__name{
           buckets {
            doc_count
            key
          }
        }
      }
    }
  }`,
  variables: sqon,
  transform: data => {
    const buckets = get(data, 'data.participant.aggregations.study__name.buckets');

    console.log('studies query', data, buckets);
    return data;
  },
});

export default compose(withTheme)(StudiesChart);
