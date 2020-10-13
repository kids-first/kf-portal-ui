import React, { useState } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import Create from './Create';
import NotConnected from './NotConnected';
import CavaticaProvider from './CavaticaProvider';
import Connected from './Connected';
import {
  trackUserInteraction,
  setUserDimension,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';

import { Badge, Result, Typography } from 'antd';
import Card from '@ferlab-ui/core-react/lib/esnext/cards/GridCard';
import { getMsgFromErrorOrElse } from 'utils';

const { Title } = Typography;

const isValidKey = (key) => key && key.length > 0;

const tabList = [
  {
    key: 'Projects',
    tab: 'Projects',
  },
  {
    key: 'Create',
    tab: 'Create',
  },
];

const generateTabsContent = ({
  isConnected,
  projectsError,
  tabToCreate,
  projects,
  loading,
  onProjectCreated,
  onProjectCreationCanceled,
  refresh,
  activeTab,
}) => {
  const NotConnectedComp = () => <NotConnected />;
  const ConnectedComp = (cardProps) => (
    <Connected tabToCreate={tabToCreate(cardProps)} projects={projects} loading={loading} />
  );
  const CreateComp = (cardProps) => (
    <Create
      onProjectCreated={onProjectCreated({ cardProps, refresh })}
      onProjectCreationCancelled={onProjectCreationCanceled(cardProps)}
    />
  );
  const ResultComp = () => () => (
    <Result style={{ width: '100%' }} status="error" title={getMsgFromErrorOrElse(projectsError)} />
  );
  if (projectsError) {
    return {
      component: ResultComp,
    };
  }

  if (isConnected) {
    if (activeTab === 'Projects') {
      return {
        component: ConnectedComp,
      };
    } else if (activeTab === 'Create') {
      return {
        component: CreateComp,
      };
    }
  }
  return {
    component: NotConnectedComp,
  };
};

const CavaticaProjects = compose(injectState)(({ state: { integrationTokens } }) => {
  const isConnected = isValidKey(integrationTokens[CAVATICA]);

  const [activeTab, setActiveTab] = useState('Projects');

  const onProjectCreated = ({ cardProps, refresh }) => (data) => {
    cardProps.setIndex(0);
    // added project data into the data param,
    // not sure of future plans for the data param
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.integration.cavatica,
      action: 'Cavatica Project:  Created',
      label: data.id,
    });

    // refresh cavatica data
    return refresh();
  };

  const onTabChange = (key) => {
    setActiveTab(key);
  };

  const onProjectCreationCanceled = (cardProps) => (data) => {
    cardProps.setIndex(0);
    // added project data into the data param,
    // not sure of future plans for the data param
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.integration.cavatica,
      action: 'Cavatica Project: Canceled',
      label: JSON.stringify({ projectName: data.projectName }),
    });
  };

  const tabToCreate = (cardProps) => () => {
    cardProps.setIndex(1);
  };

  return (
    <CavaticaProvider isConnected={isConnected}>
      {({ projects, loading, refresh, projectsError }) => {
        setUserDimension('dimension6', JSON.stringify(projects));
        return (
          <Card
            title={
              <Badge
                count={isConnected && projects ? projects.length : 0}
                offset={[8, 2]}
                showZero={isConnected}
              >
                <Title level={3}>Cavatica Projects</Title>
              </Badge>
            }
            tabList={isConnected ? tabList : []}
            onTabChange={(key) => {
              onTabChange(key);
            }}
          >
            {
              generateTabsContent({
                isConnected,
                projectsError,
                tabToCreate,
                projects,
                loading,
                onProjectCreated,
                onProjectCreationCanceled,
                refresh,
                activeTab,
              }).component
            }
          </Card>
        );
      }}
    </CavaticaProvider>
  );
});

export default CavaticaProjects;
