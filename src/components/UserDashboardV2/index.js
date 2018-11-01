import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import CardsContainer from 'uikit/Card/CardsContainer';
import Card from 'uikit/Card';

import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import ChartWrapper from 'chartkit/components/ChartWrapper';

import { initializeApi } from 'services/publicStats';

import { StudiesChart } from './charts';

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
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(() => {
  return (
    <UserDashboard>
      <Helmet>
        <title>Portal - User Dashboard</title>
      </Helmet>
      <CardsContainer>
        <DashboardCard title="Studies">
          <ChartWrapper endpoint="studies" api={initializeApi({})}>
            {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={StudiesChart} />}
          </ChartWrapper>
        </DashboardCard>
      </CardsContainer>
    </UserDashboard>
  );
});
