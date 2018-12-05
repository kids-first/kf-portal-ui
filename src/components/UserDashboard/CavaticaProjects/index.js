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

const isValidKey = key => {
  return key && key.length > 0;
};

const CavaticaProjects = compose(injectState)(({ state: { integrationTokens } }) => {
  const isConnected = isValidKey(integrationTokens[CAVATICA]);

  const onProjectCreationComplete = cardProps => data => {
    cardProps.setIndex(0);
    // added project data into the data param,
    // not sure of future plans for the data param
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.integration.cavatica,
      action: 'Cavatica Project:  Created',
      label: data.id,
    });
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
    <CavaticaProvider>
      {({ projects, loading }) => {
        setUserDimension('dimension6', JSON.stringify(projects));
        return (
          <DashboardMulticard
            inactive={!isConnected}
            scrollable={isConnected}
            tabs={
              isConnected
                ? [
                    {
                      nav: 'Projects',
                      headerComponent: cardProps => (
                        <CardHeader title="Cavatica Projects" badge={projects && projects.length} />
                      ),
                      component: cardProps => (
                        <Connected
                          tabToCreate={tabToCreate(cardProps)}
                          projects={projects}
                          loading={loading}
                        />
                      ),
                    },
                    {
                      nav: 'Create',
                      headerComponent: cardProps => (
                        <CardHeader title="Create a CAVATICA Project" badge={null} />
                      ),
                      component: cardProps => (
                        <Create
                          onProjectCreated={onProjectCreationComplete(cardProps)}
                          onProjectCreationCancelled={onProjectCreationCanceled(cardProps)}
                        />
                      ),
                    },
                  ]
                : [{ title: 'CAVATICA Projects', component: cardProps => <NotConnected /> }]
            }
          />
        );
      }}
    </CavaticaProvider>
  );
});

export default CavaticaProjects;
