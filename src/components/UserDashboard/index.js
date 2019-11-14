import * as React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose, branch, renderComponent } from 'recompose';
import { injectState } from 'freactal';
import { startCase } from 'lodash';
// [NEXT] replace by antd's grid system
import { Row, Col } from 'react-grid-system';

import ChartLoadGate from 'chartkit/components/ChartLoadGate';
import DataProvider from 'chartkit/components/DataProvider';
import MultiHeader from 'uikit/Multicard/MultiHeader';
import CardContentSpinner from 'components/Charts/ChartContentSpinner';

import { StudiesChart } from './charts';
import { withApi } from 'services/api';
import { publicStatsApiRoot, arrangerProjectId } from 'common/injectGlobals';

import SavedQueries from './SavedQueries';
import AuthorizedStudies from './AuthorizedStudies';
import CavaticaProjects from './CavaticaProjects';

import { DashboardCard, DashboardMulticard } from './styles';
import { SizeProvider } from 'components/Utils';
import DashboardCardError from './DashboardCardError';

import { MostFrequentDiagnosesChart, MemberResearchInterestsChart } from 'components/Charts';
import { userDashboardContainer, dashboardTitle } from './UserDashboard.module.css';

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
            <DataProvider
              url={`${publicStatsApiRoot}${arrangerProjectId}/studies`}
              api={api}
              transform={data =>
                (data.studies || []).map(study => ({ ...study, label: startCase(study.name) }))
              }
            >
              {fetchedState => {
                const data = fetchedState.data;
                const studies = data && data.length;
                const participants = data
                  ? data.reduce((prev, el) => prev + (el.familyMembers + el.probands), 0)
                  : null;

                return (
                  <DashboardMulticard
                    tabs={[
                      {
                        headerComponent: cardProps => (
                          <MultiHeader
                            headings={[
                              { title: 'Studies', badge: studies },
                              { title: 'Participants', badge: participants },
                            ]}
                          />
                        ),
                        component: cardProps => (
                          <ChartLoadGate
                            Error={DashboardCardError}
                            Loader={CardContentSpinner}
                            fetchedState={fetchedState}
                            Chart={StudiesChart}
                          />
                        ),
                      },
                    ]}
                  />
                );
              }}
            </DataProvider>
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
));
