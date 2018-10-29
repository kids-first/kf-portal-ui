import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import Row from 'uikit/Row';
import Card from 'uikit/Card';
import ChartWrapper from '../../chartkit/components/ChartWrapper';

const UserDashboard = styled('div')`
  ${({ theme }) => theme.row};
  width: 100%;
  min-height: 600px;
  background-color: ${({ theme }) => theme.backgroundGrey};
`;

const DashboardCard = styled(Card)`
  width: 33%;
  height: 400px;
  margin: 30px;
`;

export default compose(
  injectState,
  withRouter,
  withTheme,
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(({ state }) => {
  return (
    <UserDashboard>
      <Helmet>
        <title>Portal - User Dashboard</title>
      </Helmet>
      <Row flexWrap="wrap" width="100%">
        <DashboardCard title="Test Card Title">
          <ChartWrapper>
            <div>Got them data</div>
          </ChartWrapper>
        </DashboardCard>
      </Row>
    </UserDashboard>
  );
});
