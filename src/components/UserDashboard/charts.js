import React from 'react';
import { withTheme } from 'emotion-theming';
import _ from 'lodash';

import { titleCase } from 'common/displayFormatters';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import Donut from 'chartkit/components/Donut';

const ALLOWED_INTERESTS = []
  .concat(DISEASE_AREAS, STUDY_SHORT_NAMES)
  .map(interest => interest.toLowerCase());

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const studiesToolTip = data => {
  const { familyMembers, probands, name } = data;
  const participants = familyMembers + probands;
  return (
    <div>
      <div>{name}</div>
      <div>{`${probands} Probands`}</div>
      <div>{`${familyMembers} Family Members`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`}</div>
    </div>
  );
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
      indexBy="label"
      keys={['probands', 'familyMembers']}
      onClick={onClick}
      tooltipFormatter={studiesToolTip}
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
  const filteredInterests = data.filter(interest =>
    ALLOWED_INTERESTS.includes(interest.name.toLowerCase()),
  );
  const sortedInterests = _.orderBy(filteredInterests, ['count', 'name'], ['desc', 'asc'])
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
    url: getFileRepoURL(TEXT_DIAGNOSES_FIELD, d.name),
  }));

  const onClick = barData => (window.location.href = barData.data.url);

  return (
    <HorizontalBar
      data={mergedData}
      indexBy="label"
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
