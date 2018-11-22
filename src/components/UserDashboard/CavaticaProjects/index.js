import React, { Fragment } from 'react';
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

  return (
    <DashboardMulticard inactive={!isConnected} tabMenu={['Projects', 'Create']} scrollable>
      {isConnected ? (
        [
          <CavaticaProvider>
            {({ projects, loading }) => <Connected projects={projects} loading={loading} />}
          </CavaticaProvider>,
          <Create />,
        ]
      ) : (
        <NotConnected />
      )}
    </DashboardMulticard>
  );
});

export default CavaticaProjects;
