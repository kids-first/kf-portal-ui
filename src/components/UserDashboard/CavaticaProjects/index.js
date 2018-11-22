import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { CAVATICA } from 'common/constants';
import { withApi } from 'services/api';
import Create from './Create';
import NotConnected from './NotConnected';
import { DashboardMulticard } from '../styles';
import CavaticaProvider from './CavaticaProvider';
import Connected from './Connected';

const isValidKey = key => {
  return key && key.length > 0;
};

const CavaticaProjects = compose(
  withApi,
  injectState,
  withTheme,
)(({ state: { integrationTokens } }) => {
  const isConnected = isValidKey(integrationTokens[CAVATICA]);
  /*
    const Header = (
      <CardHeader title="Cavatica Projects" badge={badgeNumber}>
        {!isConnected &&
          cardStack.map((card, i) => (
            <DualPaneHeader
              key={i}
              active={i === stackIndex}
              onClick={() => setStackIndex(i)}
              title={card.title}
            />
          ))}
      </CardHeader>
    );*/

  return (
    <DashboardMulticard
      inactive={!isConnected}
      title="Cavatica Projects"
      tabMenu={['Projects', 'Create']}
      scrollable
    >
      <CavaticaProvider>
        {({ projects, loading }) => <Connected projects={projects} loading={loading} />}
      </CavaticaProvider>
      <Create />
    </DashboardMulticard>
  );
});

export default CavaticaProjects;
