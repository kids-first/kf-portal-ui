import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import CardsContainer from 'uikit/Card/CardsContainer';
import Card from 'uikit/Card';

import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';

import { StudiesChart } from './charts';
import { withApi } from '../../services/api';
import { publicStatsApiRoot, arrangerProjectId } from '../../common/injectGlobals';

const UserDashboard = styled('div')`
  ${({ theme }) => theme.row};
  width: 100%;
  min-height: 600px;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const DashboardCard = styled(Card)`
  width: calc(33% - 60px);
  height: 400px;
  margin: 30px;
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
      <DashboardCard title="Studies">
        <DataProvider url={`${publicStatsApiRoot}${arrangerProjectId}/studies`} api={api}>
          {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={StudiesChart} />}
        </DataProvider>
      </DashboardCard>
    </CardsContainer>
  </UserDashboard>
));
