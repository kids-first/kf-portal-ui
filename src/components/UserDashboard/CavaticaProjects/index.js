import React, { Fragment } from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';

import { DashboardCard } from '../styles';
import CardHeader from 'uikit/Card/CardHeader';
import AccessGate from '../../AccessGate';
import Cavatica from 'icons/Cavatica';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import { CAVATICA } from 'common/constants';
import {
  trackUserInteraction,
  analyticsTrigger,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';
import Component from 'react-component-component';
import { withApi } from 'services/api';

import Info from '../Info';

import { ConnectButton } from '../styles';
import Connected from './Connected';

const isValidKey = key => {
  return key && key.length > 0;
};

const cardStack = [
  {
    name: 'Projects',
  },
  { name: 'Create' },
];

const CavaticaProjects = compose(
  withApi,
  injectState,
  withTheme,
)(({ state: { integrationTokens, loggedInUser }, effects, theme, api, ...props }) => {
  return (
    <Component initialState={{ loading: false, connected: false, badgeNumber: 0, cardIndex: 0 }}>
      {({ setState, state }) => (
        <DashboardCard
          title="Cavatica Projects"
          Header={CardHeader}
          inactive={!state.connected}
          stack={cardStack}
          stackIndex={state.cardIndex}
          scrollable
        >
          {isValidKey(integrationTokens[CAVATICA]) ? (
            <Connected
              setBadge={n => (n && n !== state.badgeNumber ? setState({ badgeNumber: n }) : null)}
            />
          ) : (
            <Fragment>
              <AccessGate
                mt={'30px'}
                Icon={Cavatica}
                title="Collaborative Analysis"
                detail="To analyze Kids First data on the cloud, connect to Cavatica."
              >
                <ConnectButton
                  onClick={() => {
                    analyticsTrigger({
                      property: 'portal',
                      type: 'recording',
                      uiArea: TRACKING_EVENTS.categories.user.profile,
                      action: TRACKING_EVENTS.actions.integration.init,
                      label: TRACKING_EVENTS.labels.cavatica,
                    });
                    effects.setModal({
                      title: 'How to Connect to Cavatica',
                      component: (
                        <CavaticaConnectModal
                          onComplete={effects.unsetModal}
                          onCancel={effects.unsetModal}
                        />
                      ),
                    });
                  }}
                />
              </AccessGate>
              <Info
                link={{
                  url: 'https://kidsfirstdrc.org/support/analyze-data/',
                  text: 'CAVATICA compute cloud platform',
                }}
              />
            </Fragment>
          )}
        </DashboardCard>
      )}
    </Component>
  );
});

export default CavaticaProjects;
