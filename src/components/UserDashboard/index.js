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

import {
  MemberResearchInterestsChart,
  MostFrequentDiagnosesChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';

import {
  dashboardTitle,
  userDashboardContainer,
  userDashboardContent,
  wrapperVerticalBarChart,
} from './UserDashboard.module.css';
import { Col, Row } from 'antd';
import ParticipantSets from './ParticipantSets';

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
          <DashboardCard showHeader={false}>
            <div className={wrapperVerticalBarChart}>
              <MostParticipantsStudiesChart />
            </div>
          </DashboardCard>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard title="Member Research Interests">
            <div style={{ height: '265px' }}>
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
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard title="My Participant Sets">
            <ParticipantSets user={loggedInUser} />
          </DashboardCard>
        </Col>
      </Row>
    </div>
  </div>
));
