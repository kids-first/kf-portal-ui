import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import {
  getDefaultSqon,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
  setSqonValueAtIndex,
} from 'common/sqonUtils';
import { arrangerProjectId, publicStatsApiRoot } from 'common/injectGlobals';
import { withApi } from 'services/api';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { resetVirtualStudy, setSqons } from 'store/actionCreators/virtualStudies';

import HorizontalBar from 'chartkit/components/HorizontalBar';
import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';
import ChartError from './ChartError';
import Card from '@ferlab/ui/core/view/GridCard';

import theme from 'theme/defaultTheme';
import { Badge, Col, Row } from 'antd';
import { antCardHeader } from '../CohortBuilder/Summary/Cards/StudiesChart.module.css';
import { studiesToolTip } from 'components/Charts';

const studiesChartCategory = TRACKING_EVENTS.categories.charts.bar.studies;

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
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
    <Card
      title={
        <Row gutter={15}>
          <Col>
            <div className={antCardHeader}>
              <span className={'title-dashboard-card'}>Studies&nbsp;</span>
              <Badge count={studies} />
            </div>
          </Col>
          <Col>
            <div className={antCardHeader}>
              <span className={'title-dashboard-card'}>Participants&nbsp;</span>
              <Badge count={participants} overflowCount={99999} />
            </div>
          </Col>
        </Row>
      }
    >
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
        padding={0.4}
      />
    </Card>
  );
});

export default compose(withApi)(({ api }) => (
  <DataProvider
    url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
    api={api}
    transform={(data) => (data.studies || []).map((study) => ({ ...study, label: study.name }))}
  >
    {(fetchedState) => (
      <ChartLoadGate Error={ChartError} fetchedState={fetchedState} Chart={StudiesChart} />
    )}
  </DataProvider>
));
