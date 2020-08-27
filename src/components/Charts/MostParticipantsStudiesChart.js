import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import startCase from 'lodash/startCase';

import {
  getDefaultSqon,
  setSqonValueAtIndex,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
} from 'common/sqonUtils';
import { publicStatsApiRoot, arrangerProjectId } from 'common/injectGlobals';
import { withApi } from 'services/api';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { resetVirtualStudy, setSqons } from 'store/actionCreators/virtualStudies';

import HorizontalBar from 'chartkit/components/HorizontalBar';
import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';
import MultiHeader from 'uikit/Multicard/MultiHeader';
import Col from 'uikit/Column';
import ChartError from './ChartError';

import theme from 'theme/defaultTheme';

const studiesChartCategory = TRACKING_EVENTS.categories.charts.bar.studies;

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const studiesToolTip = (data) => {
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

const trackBarClick = (trackingEventCategory, barData) => {
  trackUserInteraction({
    category: trackingEventCategory,
    action: `Chart Bar: ${TRACKING_EVENTS.actions.click}`,
    label: `${barData.indexValue}: ${barData.id}`,
  });
};

const mapDispatchToProps = {
  setSqons,
};

const StudiesChart = compose(
  connect(null, mapDispatchToProps),
  withRouter,
)(({ data, setSqons, history }) => {
  const studies = data && data.length;
  const participants = data
    ? data.reduce((prev, el) => prev + (el.familyMembers + el.probands), 0)
    : null;

  const onClick = (barData) => {
    trackBarClick(studiesChartCategory, barData);
    resetVirtualStudy();
    const modifiedSqons = generateSqon('study.short_name', barData.data.name);
    setSqons(modifiedSqons);
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

    return setSqonValueAtIndex(getDefaultSqon(), 0, newSqon, {
      operator: MERGE_OPERATOR_STRATEGIES.OVERRIDE_OPERATOR,
      values: MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES,
    });
  };

  return (
    <Col style={{ height: '100%' }}>
      <MultiHeader
        style={{
          borderBottom: '1px solid #e0e1e6',
          paddingBottom: '20px',
        }}
        headings={[
          { title: 'Studies', badge: studies },
          { title: 'Participants', badge: participants },
        ]}
      />
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
    </Col>
  );
});

export default compose(withApi)(({ api }) => (
  <DataProvider
    url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
    api={api}
    transform={(data) =>
      (data.studies || []).map((study) => ({ ...study, label: startCase(study.name) }))
    }
  >
    {(fetchedState) => (
      <ChartLoadGate Error={ChartError} fetchedState={fetchedState} Chart={StudiesChart} />
    )}
  </DataProvider>
));
