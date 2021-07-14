import React from 'react';
import Grid from '@ferlab/ui/core/layout/Grid';
import Card from '@ferlab/ui/core/view/GridCard';
import { injectState } from 'freactal';
import { compose } from 'recompose';

import {
  MemberResearchInterestsChart,
  MostFrequentDiagnosesChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';
import { withApi } from 'services/api';
import { Spinner } from 'uikit/Spinner';

import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';
import ParticipantSets from './ParticipantSets';
import SavedQueries from './SavedQueries';

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
)(({ state: { loggedInUser }, api }) =>
  loggedInUser ? (
    <div className={userDashboardContainer}>
      <div className={userDashboardContent}>
        <h1 className={dashboardTitle}>My Dashboard</h1>
        <Grid className={'dashboard-grid'}>
          <SavedQueries {...{ api, loggedInUser }} />
          <AuthorizedStudies api={api} loggedInUser={loggedInUser} />
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
  ) : (
    <div className={userDashboardContainer}>
      <Spinner />
    </div>
  ),
);
