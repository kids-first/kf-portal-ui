import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { fenceConnect, getAccessToken } from 'services/fence';
import FenceUserProvider from 'components/Fence/FenceUserProvider';
import CardHeader from 'uikit/Card/CardHeader';
import DownloadController from 'icons/DownloadController';

import Component from 'react-component-component';
import { withApi } from 'services/api';
import { GEN3 } from 'common/constants';
import Gen3Connected from './Gen3Connected';

import AccessGate from '../../AccessGate';
import { DashboardCard, CardContentSpinner } from '../styles';

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
  <Component initialState={{ connected: false, badgeNumber: null }}>
    {({ setState, state }) => {
      const Header = <CardHeader title="Authorized Studies" badge={state.badgeNumber} />;

      return (
        <DashboardCard Header={Header} inactive={!state.connected} scrollable={state.connected}>
          <FenceUserProvider
            fence={GEN3}
            render={({ gen3User, loading: loadingGen3User, refresh }) =>
              loadingGen3User ? (
                <CardContentSpinner />
              ) : gen3User ? (
                <Gen3Connected
                  setConnected={status => setState({ connected: status })}
                  setBadge={n =>
                    n && n !== state.badgeNumber
                      ? setState({
                          badgeNumber: n,
                        })
                      : null
                  }
                />
              ) : (
                <Fragment>
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
                        fenceConnect(api, GEN3)
                          .then(() => getAccessToken(api, GEN3))
                          .then(token => {
                            console.log('token', token);
                            effects.setIntegrationToken(GEN3, token);
                            trackUserInteraction({
                              category: TRACKING_EVENTS.categories.user.profile,
                              action: TRACKING_EVENTS.actions.integration.connected,
                              label: TRACKING_EVENTS.labels.gen3,
                            });
                            refresh();
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
                  <Info
                    link={{
                      url:
                        'https://kidsfirstdrc.org/support/studies-and-access/#applying-for-data-access',
                      text: 'applying for data access.',
                    }}
                  />
                </Fragment>
              )
            }
          />
        </DashboardCard>
      );
    }}
  </Component>
));

export default AuthorizedStudies;
