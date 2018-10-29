import * as React from 'react';
import { compose, branch, renderComponent } from 'recompose';
import { withRouter } from 'react-router-dom';
import { injectState } from 'freactal';
import { Helmet } from 'react-helmet';
import styled from 'react-emotion';

import CardsContainer from 'uikit/Card/CardsContainer';
import Card from 'uikit/Card';
import ChartWrapper from 'chartkit/components/ChartWrapper';
import HorizontalBar from 'chartkit/components/HorizontalBar';
import { ChartColors } from 'chartkit/themes';

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
  width: calc(40% - 60px);
  height: 400px;
  margin: 30px;
`;

export const data = [
  {
    id: 'Pediatric Brain Tumors: CBTTC',
    probands: 50,
    familyMembers: 100,
  },
  {
    id: 'Orofacial Cleft: European Ancestry',
    probands: 102,
    familyMembers: 167,
  },
  {
    id: 'Ewing Sarcoma: Genetic Risk',
    probands: 23,
    familyMembers: 630,
  },
  {
    id: 'Syndromic Cranial Dysinnervation',
    probands: 430,
    familyMembers: 500,
  },
  {
    id: 'Congenital Heart Defects',
    probands: 230,
    familyMembers: 550,
  },
  {
    id: 'Adolescent Idiopathic Scoliosis',
    probands: 340,
    familyMembers: 400,
  },
  {
    id: 'Congenital Diaphragmatic Hernia',
    probands: 360,
    familyMembers: 420,
  },
];

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
        <DataProvider
          url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
          api={api}
          transform={data => data.studies}
        >
          {fetchedState => <ChartLoadGate fetchedState={fetchedState} Chart={StudiesChart} />}
        </DataProvider>
      </DashboardCard>
    </CardsContainer>
  </UserDashboard>
));
