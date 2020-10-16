import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import startCase from 'lodash/startCase';

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
import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';

import theme from 'theme/defaultTheme';
import { Badge, Row, Col } from 'antd';
import Typography from 'antd/es/typography';

const { Title } = Typography;

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
    <Card
      title={
        <Row gutter={70}>
          <Col>
            <Badge offset={[15, 0]} count={studies}>
              <Title level={3}>Studies</Title>
            </Badge>
          </Col>
          <Col>
            <Badge offset={[25, 0]} overflowCount={99999} count={participants}>
              <Title level={3}>Participants</Title>
            </Badge>
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
    transform={(data) =>
      (data.studies || []).map((study) => ({ ...study, label: startCase(study.name) }))
    }
  >
    {(fetchedState) => (
      <ChartLoadGate Error={ChartError} fetchedState={fetchedState} Chart={StudiesChart} />
    )}
  </DataProvider>
));
