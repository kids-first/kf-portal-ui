import React from 'react';
import { Card } from 'antd';
import { Col, Row } from 'antd';
import { compose } from 'recompose';

import { withApi } from 'services/api';
import { Spinner } from 'uikit/Spinner';

import useUser from '../../hooks/useUser';

import AuthorizedStudies from './AuthorizedStudies';
import CaringForChildren from './CaringForChildren';
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
  const { user } = useUser();
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
            <Card title={<span className={'title-dashboard-card'}>My Participant Sets</span>}>
              <ParticipantSets user={user} />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={6}>
            <CaringForChildren />
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
