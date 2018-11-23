import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import { CAVATICA } from 'common/constants';
import Create from './Create';
import NotConnected from './NotConnected';
import { DashboardMulticard } from '../styles';
import CavaticaProvider from './CavaticaProvider';
import Connected from './Connected';

const isValidKey = key => {
  return key && key.length > 0;
};

const CavaticaProjects = compose(injectState)(({ state: { integrationTokens } }) => {
  const isConnected = isValidKey(integrationTokens[CAVATICA]);

  console.log('isConnected: ', isConnected);

  const onCavaticaData = cardState => projects => {
    cardState.setBadge(projects.length);
  };

  // leaving this duplication here for now, animation hooks to come
  const onProjectCreationComplete = cardState => data => {
    cardState.setIndex(0);
  };
  const onProjectCreationCanceled = cardState => data => {
    cardState.setIndex(0);
  };

  const unsetBadge = cardState => d => {
    cardState.setBadge(null);
  };

  const tabToCreate = cardState => d => {
    cardState.setIndex(1);
  };

  return (
    <DashboardMulticard
      inactive={!isConnected}
      scrollable={isConnected}
      tabs={
        isConnected
          ? [
              {
                title: 'Cavatica Projects',
                nav: 'Projects',
                component: cardState => (
                  <CavaticaProvider onData={onCavaticaData(cardState)}>
                    {({ projects, loading }) => (
                      <Connected
                        tabToCreate={tabToCreate(cardState)}
                        projects={projects}
                        loading={loading}
                      />
                    )}
                  </CavaticaProvider>
                ),
              },
              {
                title: 'Create a CAVATICA Project',
                nav: 'Create',
                component: cardState => (
                  <Create
                    onInit={unsetBadge(cardState)}
                    onProjectCreated={onProjectCreationComplete(cardState)}
                    onProjectCreationCancelled={onProjectCreationCanceled(cardState)}
                  />
                ),
              },
            ]
          : [{ title: 'CAVATICA Projects', component: cardState => <NotConnected /> }]
      }
    />
  );
});

export default CavaticaProjects;
