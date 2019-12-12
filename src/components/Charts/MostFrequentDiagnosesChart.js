import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import orderBy from 'lodash/orderBy';
import startCase from 'lodash/startCase';

import { publicStatsApiRoot, arrangerProjectId } from 'common/injectGlobals';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { resetVirtualStudy, setSqons } from 'store/actionCreators/virtualStudies';
import { withApi } from 'services/api';

import theme from 'theme/defaultTheme';
import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import {
  getDefaultSqon,
  setSqonValueAtIndex,
  MERGE_OPERATOR_STRATEGIES,
  MERGE_VALUES_STRATEGIES,
} from 'common/sqonUtils';

import ChartContentSpinner from './ChartContentSpinner';
import ChartError from './ChartError';

export default compose(withApi)(({ api }) => (
  <DataProvider
    url={`${publicStatsApiRoot}${arrangerProjectId}/diagnoses/text`}
    api={api}
    transform={data => {
      const dxs = data.diagnoses || [];
      const orderedDxs = orderBy(
        dxs,
        diagnosis => diagnosis.familyMembers + diagnosis.probands,
        'desc',
      );
      return orderedDxs.slice(0, 10).map(d => ({ ...d, label: startCase(d.name) }));
    }}
  >
    {fetchedState => (
      <ChartLoadGate
        Error={ChartError}
        Loader={ChartContentSpinner}
        fetchedState={fetchedState}
        Chart={TopDiagnosesChart}
      />
    )}
  </DataProvider>
));

const trackBarClick = (trackingEventCategory, barData) => {
  trackUserInteraction({
    category: trackingEventCategory,
    action: `Chart Bar: ${TRACKING_EVENTS.actions.click}`,
    label: `${barData.indexValue}: ${barData.id}`,
  });
};

const participantTooltipFormatter = data => {
  const participants = data.familyMembers + data.probands;
  return `${participants.toLocaleString()} Participant${participants > 1 ? 's' : ''}`;
};

const sortDescParticipant = (a, b) => {
  const aTotal = a.probands + a.familyMembers;
  const bTotal = b.probands + b.familyMembers;
  return aTotal <= bTotal ? -1 : 1;
};

const mapDispatchToProps = {
  setSqons,
  resetVirtualStudy,
};

const TopDiagnosesChart = connect(
  null,
  mapDispatchToProps,
)(
  compose(withRouter)(({ data, setSqons, resetVirtualStudy, history }) => {
    const TEXT_DIAGNOSES_FIELD = 'diagnoses.diagnosis';

    const onClick = barData => {
      trackBarClick(TRACKING_EVENTS.categories.charts.bar.diagnosesChartCategory, barData);
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
        tooltipFormatter={participantTooltipFormatter}
        sortBy={sortDescParticipant}
        analyticsTracking={{
          category: TRACKING_EVENTS.categories.charts.bar.diagnosesChartCategory,
        }}
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
  }),
);
