import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { branch, compose, renderComponent } from 'recompose';
import { injectState } from 'freactal';
import { withApi } from 'services/api';

import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';

import { DashboardCard } from './styles';

import {
  MemberResearchInterestsChart,
  MostFrequentDiagnosesChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';

import {
  dashboardTitle,
  userDashboardContainer,
  userDashboardContent,
} from './UserDashboard.module.css';
import { Col, Row } from 'antd';

const Container = ({ className = '', children }) => (
  // This is to cancel out the negative margin set by react-grid-system
  <div style={{ marginLeft: '15px', marginRight: '15px' }}>
    <Row className={className} children={children} />
  </div>
);

Container.prototype = {
  children: PropTypes.arrayOf(PropTypes.element),
  className: PropTypes.string.isRequired,
};

export default compose(
  injectState,
  withRouter,
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
      <Row gutter={[30, 30]} align={'top'} style={{paddingLeft: 15, paddingRight: 15, top:-15}}>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <SavedQueries {...{ api, loggedInUser }} />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <AuthorizedStudies />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <CavaticaProjects />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard showHeader={false}>
            <MostParticipantsStudiesChart />
          </DashboardCard>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard title="Member Research Interests">
            <MemberResearchInterestsChart />
          </DashboardCard>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <DashboardCard title="Most Frequent Diagnoses">
            <MostFrequentDiagnosesChart />
          </DashboardCard>
        </Col>
      </Row>
    </div>
  </div>
));
