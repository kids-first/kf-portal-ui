import React from 'react';
import { withTheme } from 'emotion-theming';
import _ from 'lodash';

import { titleCase } from 'common/displayFormatters';
import { DISEASE_AREAS, STUDY_SHORT_NAMES } from 'common/constants';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import Donut from 'chartkit/components/Donut';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';

import { resetVirtualStudy, setSqons } from 'store/actionCreators/virtualStudies';
import { connect } from 'react-redux';
import {
  getDefaultSqon,
  setSqonValueAtIndex,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
} from '../../common/sqonUtils';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

const {
  categories: {
    charts: {
      bar: { studies: studiesChartCategory, diagnoses: diagnosesChartCategory },
    },
  },
} = TRACKING_EVENTS;

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
      <div>{`${probands.toLocaleString()} Probands`}</div>
      <div>{`${familyMembers.toLocaleString()} Other Participants`}</div>
      <div>{`${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`}</div>
    </div>
  );
};

const participantTooltip = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const SHORT_NAME_FIELD = 'study.short_name';
const TEXT_DIAGNOSES_FIELD = 'diagnoses.diagnosis';

const trackBarClick = (trackingEventCategory, barData) => {
  trackUserInteraction({
    category: trackingEventCategory,
    action: `Chart Bar: ${TRACKING_EVENTS.actions.click}`,
    label: `${barData.indexValue}: ${barData.id}`,
  });
};

export const studiesChart = compose(
  withRouter,
  withTheme,
)(({ data, theme, setSqons, virtualStudy, history }) => {
  const onClick = barData => {
    trackBarClick(studiesChartCategory, barData);
    resetVirtualStudy();
    generateSqon(SHORT_NAME_FIELD, barData.data.name);
    history.push('/explore');
  };

  const generateSqon = (field, value) => {
    const newSqon = {
      op: 'in',
      content: {
        field,
        value: [value],
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      getDefaultSqon(),
      0,
      newSqon,
      {
        operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
        values: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      },
    );
    setSqons(modifiedSqons);
  };

  return (
    <HorizontalBar
      data={data}
      indexBy="label"
      keys={['probands', 'familyMembers']}
      onClick={onClick}
      tooltipFormatter={studiesToolTip}
      analyticsTracking={{ category: studiesChartCategory }}
      sortBy={sortDescParticipant}
      tickInterval={4}
      colors={[theme.chartColors.blue, theme.chartColors.purple]}
      xTickTextLength={28}
      legends={[
        { title: 'Probands', color: theme.chartColors.blue },
        { title: 'Other Participants', color: theme.chartColors.purple },
      ]}
      padding={0.7}
    />
  );
});

const mapStateToProps = state => ({
  virtualStudy: state.currentVirtualStudy,
});

const mapDispatchToProps = {
  setSqons,
};

export const StudiesChart = connect(
  mapStateToProps,
  mapDispatchToProps,
)(studiesChart);

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

  return (
    <Donut
      analyticsTracking={{
        category: TRACKING_EVENTS.categories.charts.donut.userInterests,
      }}
      data={sortedInterests}
      colors={[theme.chartColors.red, '#FFF']}
    />
  );
});

export const topDiagnoseChart = compose(
  withRouter,
  withTheme,
)(({ data, theme, setSqons, virtualStudy, history }) => {

  const onClick = barData => {
    trackBarClick(diagnosesChartCategory, barData);
    resetVirtualStudy();
    generateSqon(TEXT_DIAGNOSES_FIELD, barData.data.name);
    history.push('/explore');
  };

  const generateSqon = (field, value) => {
    const newSqon = {
      op: 'in',
      content: {
        field,
        value: [value],
      },
    };

    const modifiedSqons = setSqonValueAtIndex(
      getDefaultSqon(),
      0,
      newSqon,
      {
        operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
        values: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
      },
    );
    setSqons(modifiedSqons);
  };

  return (
    <HorizontalBar
      data={data}
      indexBy="label"
      keys={['probands', 'familyMembers']}
      onClick={onClick}
      tooltipFormatter={participantTooltip}
      sortBy={sortDescParticipant}
      analyticsTracking={{ category: diagnosesChartCategory }}
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

export const TopDiagnosesChart = connect(
  mapStateToProps,
  mapDispatchToProps,
)(topDiagnoseChart);
