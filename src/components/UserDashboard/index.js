import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose, branch, renderComponent } from 'recompose';
import { injectState } from 'freactal';
// [NEXT] replace by antd's grid system
import { Row, Col } from 'react-grid-system';

import { withApi } from 'services/api';

import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';

import { DashboardCard } from './styles';
import { SizeProvider } from 'components/Utils';

import {
  MostFrequentDiagnosesChart,
  MemberResearchInterestsChart,
  MostParticipantsStudiesChart,
} from 'components/Charts';

import {
  userDashboardContainer,
  userDashboardContent,
  dashboardTitle,
} from './UserDashboard.module.css';

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

const ContainerRow = ({ currentWidth = NaN, children }) => (
  <Container
    style={{
      paddingLeft: `${currentWidth < 500 ? 0 : 15}px`,
      paddingRight: `${currentWidth < 500 ? 0 : 15}px`,
    }}
  >
    {children}
  </Container>
);

const CardSlot = ({ className = '', children, ...props }) => (
  <Col style={{ paddingBottom: '30px' }} {...props}>
    {children}
  </Col>
);

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
      <SizeProvider>
        {({ size }) => (
          <ContainerRow currentWidth={size.width}>
            <CardSlot sm={12} md={6} lg={6} xl={4}>
              <SavedQueries {...{ api, loggedInUser }} />
            </CardSlot>
            <CardSlot sm={12} md={6} lg={6} xl={4}>
              <AuthorizedStudies />
            </CardSlot>
            <CardSlot sm={12} md={6} lg={6} xl={4}>
              <CavaticaProjects />
            </CardSlot>
            <CardSlot sm={12} md={6} lg={6} xl={4}>
              <DashboardCard showHeader={false}>
                <MostParticipantsStudiesChart />
              </DashboardCard>
            </CardSlot>
            <CardSlot sm={12} md={6} lg={6} xl={4}>
              <DashboardCard title="Member Research Interests">
                <MemberResearchInterestsChart />
              </DashboardCard>
            </CardSlot>
            <CardSlot sm={12} md={6} lg={6} xl={4}>
              <DashboardCard title="Most Frequent Diagnoses">
                <MostFrequentDiagnosesChart />
              </DashboardCard>
            </CardSlot>
          </ContainerRow>
        )}
      </SizeProvider>
    </div>
  </div>
));
