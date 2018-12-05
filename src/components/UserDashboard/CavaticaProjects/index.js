import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import Create from './Create';
import NotConnected from './NotConnected';
import { DashboardMulticard } from '../styles';
import CavaticaProvider from './CavaticaProvider';
import Connected from './Connected';
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

  console.log('isConnected: ', isConnected);

  const onCavaticaData = cardState => projects => {
    cardState.setBadge(projects.length);
    setUserDimension('dimension6', JSON.stringify(projects));
  };

  // leaving this duplication here for now, animation hooks to come
  const onProjectCreationComplete = cardState => data => {
    cardState.setIndex(0);
    // added project data into the data param,
    // not sure of future plans for the data param
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.integration.cavatica,
      action: 'Cavatica Project:  Created',
      label: data.id,
    });
  };
  const onProjectCreationCanceled = cardState => data => {
    cardState.setIndex(0);
    // added project data into the data param,
    // not sure of future plans for the data param
    trackUserInteraction({
      category: TRACKING_EVENTS.categories.integration.cavatica,
      action: 'Cavatica Project: Canceled',
      label: JSON.stringify({ projectName: data.projectName }),
    });
  };
  const onProjectCreationCanceled = cardProps => data => {
    cardProps.setIndex(0);
  };

  const tabToCreate = cardProps => d => {
    cardProps.setIndex(1);
  };

  return (
    <CavaticaProvider>
      {({ projects, loading }) => (
        <DashboardMulticard
          inactive={!isConnected}
          scrollable={isConnected}
          tabs={
            isConnected
              ? [
                  {
                    title: 'Cavatica Projects',
                    nav: 'Projects',
                    headerComponent: cardProps => null,
                    component: cardProps => (
                      <Connected
                        tabToCreate={tabToCreate(cardProps)}
                        projects={projects}
                        loading={loading}
                      />
                    ),
                  },
                  {
                    title: 'Create a CAVATICA Project',
                    nav: 'Create',

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
      )}
    </CavaticaProvider>
  );
});

export default CavaticaProjects;
