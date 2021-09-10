import React from 'react';
import Grid from '@ferlab/ui/core/layout/Grid';
import Card from '@ferlab/ui/core/view/GridCard';
import { compose } from 'recompose';

import { isKfInvestigator } from 'common/profile';
import WorkBench from 'pages/variantsSearchPage/WorkBench';
import { withApi } from 'services/api';
import { Spinner } from 'uikit/Spinner';

import useUser from '../../hooks/useUser';

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
