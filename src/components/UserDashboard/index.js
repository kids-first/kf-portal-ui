import React from 'react';
import Grid from '@ferlab/ui/core/layout/Grid';
import Card from '@ferlab/ui/core/view/GridCard';
import { compose } from 'recompose';

import { isKfInvestigator } from 'common/profile';
import AuthorizedStudies from 'components/UserDashboard/AuthorizedStudies';
import CavaticaProjects from 'components/UserDashboard/CavaticaProjects';
import ParticipantSets from 'components/UserDashboard/ParticipantSets';
import SavedQueries from 'components/UserDashboard/SavedQueries';
import {
  dashboardTitle,
  userDashboardContainer,
  userDashboardContent,
} from 'components/UserDashboard/UserDashboard.module.css';
import WorkBench from 'components/UserDashboard/WorkBench';
import useUser from 'hooks/useUser';
import { withApi } from 'services/api';
import { Spinner } from 'uikit/Spinner';

import 'components/UserDashboard/UserDashboard.module.css';
import 'components/UserDashboard/UserDashboard.scss';

export default compose(withApi)(({ api }) => {
  const { user, groups } = useUser();
  return user ? (
    <div className={userDashboardContainer}>
      <div className={userDashboardContent}>
        <h1 className={dashboardTitle}>My Dashboard</h1>
        <Grid className={'dashboard-grid'}>
          <SavedQueries api={api} />
          <AuthorizedStudies api={api} />
          <CavaticaProjects />
          <Card
            classNameCardItem={'withScroll'}
            title={<span className={'title-dashboard-card'}>Apache Zeppelin</span>}
          >
            <WorkBench isAllowed={isKfInvestigator(groups)} />
          </Card>
          <Card
            classNameCardItem={'withScroll'}
            title={<span className={'title-dashboard-card'}>My Participant Sets</span>}
          >
            <ParticipantSets user={user} />
          </Card>
        </Grid>
      </div>
    </div>
  ) : (
    <div className={userDashboardContainer}>
      <Spinner />
    </div>
  );
});
