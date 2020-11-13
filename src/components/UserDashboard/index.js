import * as React from 'react';
import { branch, compose, renderComponent } from 'recompose';
import { injectState } from 'freactal';

import { withApi } from 'services/api';
import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';
import ParticipantSets from './ParticipantSets';

import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';
import Grid from '@ferlab-ui/core-react/lib/esnext/layout/Grid';
import {
  MemberResearchInterestsChart,
  MostFrequentDiagnosesChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';

import './UserDashboard.module.css';
import './UserDashboard.scss';

import {
  dashboardTitle,
  userDashboardContainer,
  userDashboardContent,
} from './UserDashboard.module.css';
import Typography from 'antd/es/typography';

const { Title } = Typography;

export default compose(
  injectState,
  withApi,
  branch(
    ({ state: { loggedInUser } }) => !loggedInUser,
    renderComponent(() => <div />),
  ),
)(({ state: { loggedInUser }, api }) => (
  <div className={userDashboardContainer}>
    <div className={userDashboardContent}>
      <h1 className={dashboardTitle}>My Dashboard</h1>
      <Grid>
        <SavedQueries {...{ api, loggedInUser }} />
        <AuthorizedStudies />
        <CavaticaProjects />
        <MostParticipantsStudiesChart />
        <Card title={<Title level={3}>Member Research Interests</Title>}>
          <MemberResearchInterestsChart />
        </Card>
        <Card title={<Title level={3}>Most Frequent Diagnoses</Title>}>
          <MostFrequentDiagnosesChart />
        </Card>
        <Card classNameCardItem={'withScroll'} title={<Title level={3}>My Participant Sets</Title>}>
          <ParticipantSets user={loggedInUser} />
        </Card>
      </Grid>
    </div>
  </div>
));
