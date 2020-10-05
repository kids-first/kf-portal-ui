import * as React from 'react';
import { branch, compose, renderComponent } from 'recompose';
import { injectState } from 'freactal';

import { withApi } from 'services/api';
import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';
import ParticipantSets from './ParticipantSets';

import { Card } from 'antd';
import {
  MemberResearchInterestsChart,
  MostFrequentDiagnosesChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';

import './UserDashboard.module.css';
import './UserDashboard.scss';

import {
  dashboardCard,
  dashboardCardWrapper,
  dashboardTitle,
  userDashboardContainer,
  userDashboardContent,
  wrapperMemberResearchInterests,
  wrapperMostParticipantsStudiesChart,
  wrapperVerticalBarChart,
} from './UserDashboard.module.css';
import GridContainer from '../GridContainer';
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
      <GridContainer>
        <SavedQueries {...{ api, loggedInUser }} />
        <AuthorizedStudies />
        <CavaticaProjects />
        <Card>
          <div className={wrapperMostParticipantsStudiesChart}>
            <MostParticipantsStudiesChart />
          </div>
        </Card>
        <Card title="Member Research Interests">
          <div className={wrapperMemberResearchInterests}>
            <MemberResearchInterestsChart />
          </div>
        </Card>
        <Card title="Most Frequent Diagnoses">
          <div className={wrapperVerticalBarChart}>
            <MostFrequentDiagnosesChart />
          </div>
        </Card>
        <Card
          title={<Title level={3}>My Participant Sets</Title>}
          className={`participant-sets-container ${dashboardCard} ${dashboardCardWrapper}`}
        >
          <ParticipantSets user={loggedInUser} />
        </Card>
      </GridContainer>
    </div>
  </div>
));
