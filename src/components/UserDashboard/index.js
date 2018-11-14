import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import CardsContainer from 'uikit/Card/CardsContainer';

import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';

import { StudiesChart, TopDiagnosesChart } from './charts';
import { withApi } from '../../services/api';
import { publicStatsApiRoot, arrangerProjectId } from '../../common/injectGlobals';

import SavedQueries from './SavedQueries';
import { withTheme } from 'emotion-theming';

import { DashboardCard } from './styles';
import CardHeader from '../../uikit/Card/CardHeader';

const UserDashboard = styled('div')`
  width: 100%;
  min-height: 600px;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const DashboardTitle = styled('h1')`
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 28px;
  font-weight: 500;
  text-align: left;
  color: ${({ theme }) => theme.secondary};
  margin-left: 34px;
  margin-top: 26px;
  margin-bottom: 24px;
`;

export default compose(
  injectState,
  withRouter,
  withApi,
  withTheme,
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(({ state: { loggedInUser }, theme, api }) => (
  <UserDashboard>
    <Helmet>
      <title>Portal - User Dashboard</title>
    </Helmet>
    <DashboardTitle>My Dashboard</DashboardTitle>
    <CardsContainer>
      <SavedQueries {...{ api, loggedInUser, theme }} />
      <DashboardCard title="Studies" Header={CardHeader}>
        <DataProvider
          url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
          api={api}
          transform={data => data.studies}
        >
          {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={StudiesChart} />}
        </DataProvider>
      </DashboardCard>
      <DashboardCard title="Top Diagnoses" Header={CardLegendHeader} scrollable>
        <DataProvider
          url={`${publicStatsApiRoot}${arrangerProjectId}/diagnoses/text`}
          api={api}
          transform={data => data.diagnoses}
        >
          {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={TopDiagnosesChart} />}
        </DataProvider>
      </DashboardCard>
    </CardsContainer>
  </UserDashboard>
));
