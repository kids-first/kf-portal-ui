import * as React from 'react';
import { branch, compose, renderComponent } from 'recompose';
import { injectState } from 'freactal';

import { withApi } from 'services/api';
import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';
import ParticipantSets from './ParticipantSets';

import Card from '@ferlab/ui/core/view/GridCard';
import Grid from '@ferlab/ui/core/layout/Grid';
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
      <Grid className={'dashboard-grid'}>
        <SavedQueries {...{ api, loggedInUser }} />
        <AuthorizedStudies />
        <CavaticaProjects />
        <MostParticipantsStudiesChart />
        <Card title={<span className={'title-dashboard-card'}>Member Research Interests</span>}>
          <MemberResearchInterestsChart />
        </Card>
        <Card title={<span className={'title-dashboard-card'}>Most Frequent Diagnoses</span>}>
          <MostFrequentDiagnosesChart />
        </Card>
        <Card
          classNameCardItem={'withScroll'}
          title={<span className={'title-dashboard-card'}>My Participant Sets</span>}
        >
          <ParticipantSets user={loggedInUser} />
        </Card>
      </Grid>
    </div>
  </div>
));
