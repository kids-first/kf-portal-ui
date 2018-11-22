import React from 'react';
import { withTheme } from 'emotion-theming';
import _ from 'lodash';

import { titleCase } from 'common/displayFormatters';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import Donut from 'chartkit/components/Donut';

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const participantTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const sqon = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: null,
    },
  ],
};

const SHORT_NAME_FIELD = 'participants.study.short_name';
const TEXT_DIAGNOSES_FIELD = 'participants.diagnoses.diagnosis';

const getFileRepoURL = (field, value) => {
  sqon.content[0].content = { field, value };
  const x = `/search/file?sqon=${encodeURI(JSON.stringify(sqon))}`;
  return x;
};

export const StudiesChart = withTheme(({ data, theme }) => {
  const mergedStudyData = data.map(d => ({
    ...d,
    url: getFileRepoURL(SHORT_NAME_FIELD, d.name),
  }));

  const onClick = barData => (window.location.href = barData.data.url);

  return (
    <HorizontalBar
      data={mergedStudyData}
      indexBy="name"
      keys={['probands', 'familyMembers']}
      onClick={onClick}
      tooltipFormatter={participantTooltip}
      sortBy={sortDescParticipant}
      tickInterval={4}
      colors={[theme.chartColors.blue, theme.chartColors.purple]}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: theme.chartColors.blue },
        { title: 'Family Members', color: theme.chartColors.purple },
      ]}
      padding={0.7}
    />
  );
});

export const UserInterestsChart = withTheme(({ data, theme }) => {
  // sort by count then alpha, limit to top 10
  const sortedInterests = _.orderBy(data, ['count', 'name'], ['desc', 'asc'])
    .slice(0, 10)
    .map(interest => ({
      id: titleCase(interest.name),
      label: titleCase(interest.name),
      value: interest.count,
    }));

  return <Donut data={sortedInterests} colors={[theme.chartColors.red, '#FFF']} />;
});

export const TopDiagnosesChart = withTheme(({ data, theme }) => {
  const mergedData = data.map(d => ({
    ...d,
    url: getFileRepoURL(TEXT_DIAGNOSES_FIELD, _.lowerCase(d.name)),
  }));

  const onClick = barData => (window.location.href = barData.data.url);

  return (
    <HorizontalBar
      data={mergedData}
      indexBy="name"
      keys={['probands', 'familyMembers']}
      onClick={onClick}
      tooltipFormatter={participantTooltip}
      sortBy={sortDescParticipant}
      tickInterval={4}
      colors={[theme.chartColors.blue, theme.chartColors.purple]}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: theme.chartColors.blue },
        { title: 'Family Members', color: theme.chartColors.purple },
      ]}
      padding={0.4}
    />
  );
});
