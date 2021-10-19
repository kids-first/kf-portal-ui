import React from 'react';
import { Card } from 'antd';
import { Col, Row } from 'antd';
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

import CaringForChildren from './CaringForChildren';

import 'components/UserDashboard/UserDashboard.module.css';
import 'components/UserDashboard/UserDashboard.scss';

export default compose(withApi)(({ api }) => {
  const { user, groups } = useUser();
  return user ? (
    <div className={userDashboardContainer}>
      <div className={userDashboardContent}>
        <h1 className={dashboardTitle}>My Dashboard</h1>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <SavedQueries api={api} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <AuthorizedStudies api={api} />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <CavaticaProjects />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <Card
              classNameCardItem={'withScroll'}
              title={<span className={'title-dashboard-card'}>Apache Zeppelin</span>}
            >
              <WorkBench isAllowed={isKfInvestigator(groups)} />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <CaringForChildren />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <Card title={<span className={'title-dashboard-card'}>My Participant Sets</span>}>
              <ParticipantSets user={user} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  ) : (
    <div className={userDashboardContainer}>
      <Spinner />
    </div>
  );
});
