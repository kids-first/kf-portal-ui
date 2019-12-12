import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import Create from './Create';
import NotConnected from './NotConnected';
import { DashboardMulticard } from '../styles';
import CavaticaProvider from './CavaticaProvider';
import Connected from './Connected';
import CardHeader from 'uikit/Card/CardHeader';
import {
  trackUserInteraction,
  setUserDimension,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';

import { Result } from 'antd';
import { getMsgFromErrorOrElse } from 'utils';

const isValidKey = key => {
  return key && key.length > 0;
};

const generateTabsContent = ({
  isConnected,
  projectsError,
  tabToCreate,
  projects,
  loading,
  onProjectCreated,
  onProjectCreationCanceled,
  refresh,
}) => {
  if (projectsError) {
    return [
      {
        headerComponent: cardProps => <CardHeader title="Cavatica Projects" badge={null} />,
        title: 'Cavatica Projects',
        component: cardProps => (
          <Result
            style={{ width: '100%' }}
            status="error"
            title={getMsgFromErrorOrElse(projectsError)}
          />
        ),
      },
    ];
  }

  return isConnected
    ? [
        {
          nav: 'Projects',
          headerComponent: cardProps => (
            <CardHeader title="Cavatica Projects" badge={projects && projects.length} />
          ),
          component: cardProps => (
            <Connected tabToCreate={tabToCreate(cardProps)} projects={projects} loading={loading} />
          ),
        },
        {
          nav: 'Create',
          headerComponent: cardProps => (
            <CardHeader title="Create a Cavatica Project" badge={null} />
          ),
          component: cardProps => (
            <Create
              onProjectCreated={onProjectCreated({ cardProps, refresh })}
              onProjectCreationCancelled={onProjectCreationCanceled(cardProps)}
            />
          ),
        },
      ]
    : [{ title: 'Cavatica Projects', component: cardProps => <NotConnected /> }];
};

const CavaticaProjects = compose(injectState)(({ state: { integrationTokens } }) => {
  const isConnected = isValidKey(integrationTokens[CAVATICA]);

  const onProjectCreated = ({ cardProps, refresh }) => data => {
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

  const onProjectCreationCanceled = cardProps => data => {
    cardProps.setIndex(0);
    // added project data into the data param,
    // not sure of future plans for the data param
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.integration.cavatica,
      action: 'Cavatica Project: Canceled',
      label: JSON.stringify({ projectName: data.projectName }),
    });
  };

  const tabToCreate = cardProps => d => {
    cardProps.setIndex(1);
  };

  return (
    <CavaticaProvider isConnected={isConnected}>
      {({ projects, loading, refresh, projectsError }) => {
        setUserDimension('dimension6', JSON.stringify(projects));
        return (
          <DashboardMulticard
            inactive={!isConnected}
            scrollable={isConnected}
            tabs={generateTabsContent({
              isConnected,
              projectsError,
              tabToCreate,
              projects,
              loading,
              onProjectCreated,
              onProjectCreationCanceled,
              refresh,
            })}
          />
        );
      }}
    </CavaticaProvider>
  );
});

export default CavaticaProjects;
