import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { connectGen3, getAccessToken } from 'services/gen3';
import { Gen3UserProvider } from 'services/gen3';
import CardHeader from 'uikit/Card/CardHeader';
import DownloadController from 'icons/DownloadController';
import LoadingSpinner from 'uikit/LoadingSpinner';

import Component from 'react-component-component';
import { withApi } from 'services/api';
import { GEN3 } from 'common/constants';
import Gen3Connected from './Gen3Connected';

import AccessGate from '../../AccessGate';
import { DashboardCard } from '../styles';

import {
  trackUserInteraction,
  analyticsTrigger,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';

import Info from '../Info';

import { ConnectButton } from '../styles';

const AuthorizedStudies = compose(
  withApi,
  injectState,
  withTheme,
)(({ state: { integrationTokens, loggedInUser }, effects, theme, api, ...props }) => (
  <Component initialState={{ loading: false, connected: false, badgeNumber: null }}>
    {({ setState, state }) => {
      const Header = <CardHeader title="Authorized Studies" badge={state.badgeNumber} />;

      return (
        <DashboardCard Header={Header} inactive={!state.connected} scrollable={state.connected}>
          <Gen3UserProvider
            render={({ gen3User, loading: loadingGen3User }) =>
              loadingGen3User ? (
                <LoadingSpinner />
              ) : gen3User ? (
                <Gen3Connected
                  setBadge={n =>
                    n && n !== state.badgeNumber ? setState({ badgeNumber: n }) : null
                  }
                />
              ) : (
                <AccessGate
                  mt={'40px'}
                  Icon={DownloadController}
                  title="Access Controlled Data"
                  detail="To access controlled study files, connect to Gen3."
                >
                  <ConnectButton
                    onClick={() => {
                      analyticsTrigger({
                        property: 'portal',
                        type: 'recording',
                        uiArea: TRACKING_EVENTS.categories.user.profile,
                        action: TRACKING_EVENTS.actions.integration.init,
                        label: TRACKING_EVENTS.labels.gen3,
                      });
                      setState({ loading: true });
                      connectGen3(api)
                        .then(() => getAccessToken(api))
                        .then(token => {
                          console.log('token', token);
                          effects.setIntegrationToken(GEN3, token);
                          setState({ loading: false, connected: true });
                          trackUserInteraction({
                            category: TRACKING_EVENTS.categories.user.profile,
                            action: TRACKING_EVENTS.actions.integration.connected,
                            label: TRACKING_EVENTS.labels.gen3,
                          });
                        })
                        .catch(err => {
                          console.log('err: ', err);
                          setState({ loading: false });
                          trackUserInteraction({
                            category: TRACKING_EVENTS.categories.user.profile,
                            action: TRACKING_EVENTS.actions.integration.failed,
                            label: TRACKING_EVENTS.labels.gen3,
                          });
                        });
                    }}
                  />
                </AccessGate>
              )
            }
          />
          <Info
            link={{
              url: 'https://kidsfirstdrc.org/support/studies-and-access/#applying-for-data-access',
              text: 'applying for data access.',
            }}
          />
        </DashboardCard>
      );
    }}
  </Component>
));

export default AuthorizedStudies;
