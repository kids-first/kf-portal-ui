import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import CardsContainer from 'uikit/Card/CardsContainer';
import Card from 'uikit/Card';
import CardHeader from 'uikit/Card/CardHeader';

import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';

import { StudiesChart, TopDiagnosesChart } from './charts';
import { withApi } from '../../services/api';
import { publicStatsApiRoot, arrangerProjectId } from '../../common/injectGlobals';

const UserDashboard = styled('div')`
  ${({ theme }) => theme.row};
  width: 100%;
  min-height: 600px;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const DashboardCard = styled(Card)`
  width: calc(40% - 60px);
  height: 404px;
  margin: 30px;
`;

const CardLegendHeader = styled(CardHeader)`
  margin-bottom: 4px;
`;

export default compose(
  injectState,
  withRouter,
  withApi,
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(({ api }) => (
  <UserDashboard>
    <Helmet>
      <title>Portal - User Dashboard</title>
    </Helmet>
    <CardsContainer>
      <DashboardCard title="Studies" Header={CardLegendHeader}>
        <DataProvider
          url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
          api={api}
          transform={data => data.studies}
        >
          {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={StudiesChart} />}
        </DataProvider>
      </DashboardCard>
      <DashboardCard title="Top Diagnoses" Header={CardLegendHeader}>
        <DataProvider
          url={`${publicStatsApiRoot}${arrangerProjectId}/diagnoses/text`}
          api={api}
          transform={data => data.studies}
        >
          {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={TopDiagnosesChart} />}
        </DataProvider>
      </DashboardCard>
    </CardsContainer>
  </UserDashboard>
));
