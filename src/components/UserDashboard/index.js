import * as React from 'react';
import { branch, compose, renderComponent } from 'recompose';
import { injectState } from 'freactal';

import { withApi } from 'services/api';
import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';

import OntologySunburst from '../Charts/Ontology/OntologySunburst';
import { DashboardCard } from './styles';

import { isFeatureEnabled } from 'common/featuresToggles';
import { Card, Col, Row, Typography } from 'antd';
import {
  MemberResearchInterestsChart,
  MostFrequentDiagnosesChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';

import './UserDashboard.module.css';
import './UserDashboard.css';

import {
  dashboardCard,
  dashboardTitle,
  userDashboardContainer,
  userDashboardContent,
  wrapperMemberResearchInterests,
  wrapperMostParticipantsStudiesChart,
  wrapperVerticalBarChart,
  dashboardCardWrapper,
} from './UserDashboard.module.css';

import ParticipantSets from './ParticipantSets';
import { isPartOfGroup } from '../../common/profile';

const { Title } = Typography;

export default compose(
  injectState,
  withApi,
  branch(
    ({ state: { loggedInUser } }) => !loggedInUser,
    renderComponent(() => <div />),
  ),
)(({ state: { loggedInUser, egoGroups }, api }) => (
  <div className={userDashboardContainer}>
    <div className={userDashboardContent}>
      <h1 className={dashboardTitle}>My Dashboard</h1>
      {/* [NEXT] SizeProvider here is the only usage of 'react-sizeme' */}
      <Row gutter={[30, 30]} align={'top'} style={{ paddingLeft: 15, paddingRight: 15, top: -15 }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <div className={wrapperVerticalBarChart}>
            <SavedQueries {...{ api, loggedInUser }} />
          </div>
        </Col>
        {isFeatureEnabled('FT_SUNBURST') && (
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <DashboardCard title="Observed Phenotypes">
              <OntologySunburst />
            </DashboardCard>
          </Col>
        )}
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <AuthorizedStudies />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <CavaticaProjects />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard showHeader={false} showScrollFullHeight={true}>
            <div className={wrapperMostParticipantsStudiesChart}>
              <MostParticipantsStudiesChart />
            </div>
          </DashboardCard>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard title="Member Research Interests">
            <div className={wrapperMemberResearchInterests}>
              <MemberResearchInterestsChart />
            </div>
          </DashboardCard>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard title="Most Frequent Diagnoses">
            <div className={wrapperVerticalBarChart}>
              <MostFrequentDiagnosesChart />
            </div>
          </DashboardCard>
        </Col>
        {isPartOfGroup('kf-investigator', egoGroups) && (
          <Col xs={24} sm={24} md={12} lg={12} xl={8}>
            <Card
              title={<Title level={3}>My Participant Sets</Title>}
              className={`${dashboardCard} ${dashboardCardWrapper}`}
            >
              <ParticipantSets user={loggedInUser} />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  </div>
));
