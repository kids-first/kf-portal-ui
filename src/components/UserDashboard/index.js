import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';
import _ from 'lodash';
import { Row, Col } from 'react-grid-system';

import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';

import { StudiesChart, TopDiagnosesChart, UserInterestsChart } from './charts';
import { withApi } from '../../services/api';
import { publicStatsApiRoot, arrangerProjectId } from '../../common/injectGlobals';

import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import { withTheme } from 'emotion-theming';

import { DashboardCard } from './styles';
import CardHeader from 'uikit/Card/CardHeader';
import { SizeMe } from 'react-sizeme';

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
  margin-top: 26px;
  margin-bottom: 24px;
  padding-left: 34px;
`;

const ContainerRow = styled(Row)`
  padding-left: ${({ currentWidth = NaN }) => (currentWidth < 500 ? 10 : 34)}px;
  padding-right: ${({ currentWidth = NaN }) => (currentWidth < 500 ? 10 : 34)}px;
`;

const CardSlot = styled(Col)`
  padding-bottom: 30px;
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
    <SizeMe>
      {({ size }) => (
        <ContainerRow currentWidth={size.width}>
          <CardSlot sm={12} md={6} lg={6} xl={4}>
            <SavedQueries {...{ api, loggedInUser, theme }} />
          </CardSlot>
          <CardSlot sm={12} md={6} lg={6} xl={4}>
            <AuthorizedStudies />
          </CardSlot>
          <CardSlot sm={12} md={6} lg={6} xl={4}>
            <DashboardCard title="Studies" Header={CardHeader}>
              <DataProvider
                url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
                api={api}
                transform={data => data.studies}
              >
                {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={StudiesChart} />}
              </DataProvider>
            </DashboardCard>
          </CardSlot>
          <CardSlot sm={12} md={6} lg={6} xl={4}>
            <DashboardCard title="Top Diagnoses" Header={CardHeader} scrollable>
              <DataProvider
                url={`${publicStatsApiRoot}${arrangerProjectId}/diagnoses/text`}
                api={api}
                transform={data =>
                  _(data.diagnoses)
                    .orderBy(diagnosis => diagnosis.familyMembers + diagnosis.probands, 'desc')
                    .take(10)
                    .map(d => ({ ...d, name: _.startCase(d.name) }))
                    .value()
                }
              >
                {fetchedState => (
                  <ChartLoadGate fetchedState={fetchedState} Chart={TopDiagnosesChart} />
                )}
              </DataProvider>
            </DashboardCard>
          </CardSlot>
          <CardSlot sm={12} md={6} lg={6} xl={4}>
            <DashboardCard title="Research Interests" Header={CardHeader}>
              <DataProvider
                url={`${publicStatsApiRoot}users/interests`}
                api={api}
                transform={data => data.interests}
              >
                {fetchedState => (
                  <ChartLoadGate fetchedState={fetchedState} Chart={UserInterestsChart} />
                )}
              </DataProvider>
            </DashboardCard>
          </CardSlot>
        </ContainerRow>
      )}
    </SizeMe>
  </UserDashboard>
));
