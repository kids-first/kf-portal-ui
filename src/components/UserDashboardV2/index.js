import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';
import LoadingSpinner from 'uikit/LoadingSpinner';

import Row from 'uikit/Row';
import Card from 'uikit/Card';
import ChartWrapper from 'chartkit/components/ChartWrapper';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { ChartColors } from 'chartkit/themes';
import { initializeApi } from 'services/publicStats';

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
  branch(({ state: { loggedInUser } }) => !loggedInUser, renderComponent(() => <div />)),
)(() => {
  return (
    <UserDashboard>
      <Helmet>
        <title>Portal - User Dashboard</title>
      </Helmet>
      <Row flexWrap="wrap" width="100%">
        <DashboardCard title="Studies">
          <ChartWrapper endpoint="studies" api={initializeApi({})}>
            {({ data, isLoading }) =>
              isLoading ? (
                <LoadingSpinner />
              ) : data ? (
                <HorizontalBar
                  data={data}
                  indexBy="name"
                  keys={['probands', 'familyMembers']}
                  colors={[ChartColors.blue, ChartColors.purple]}
                  tickValues={[0, 250, 500, 750, 1000, 1250]}
                  xTickTextLength={22}
                  legends={[
                    { title: '# Probands', color: '#1f9bb6' },
                    { title: '# Family Members', color: '#e3429b' },
                  ]}
                />
              ) : (
                <div>No data</div>
              )
            }
          </ChartWrapper>
        </DashboardCard>
      </Row>
    </UserDashboard>
  );
});
