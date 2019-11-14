import React from 'react';

import HorizontalBar from 'chartkit/components/HorizontalBar';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import theme from 'theme/defaultTheme';
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
      bar: { studies: studiesChartCategory },
    },
  },
} = TRACKING_EVENTS;

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

const SHORT_NAME_FIELD = 'study.short_name';

const trackBarClick = (trackingEventCategory, barData) => {
  trackUserInteraction({
    category: trackingEventCategory,
    action: `Chart Bar: ${TRACKING_EVENTS.actions.click}`,
    label: `${barData.indexValue}: ${barData.id}`,
  });
};

export const studiesChart = compose(withRouter)(({ data, setSqons, virtualStudy, history }) => {
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

    const modifiedSqons = setSqonValueAtIndex(getDefaultSqon(), 0, newSqon, {
      operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
      values: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
    });
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

export const StudiesChart = connect(mapStateToProps, mapDispatchToProps)(studiesChart);
