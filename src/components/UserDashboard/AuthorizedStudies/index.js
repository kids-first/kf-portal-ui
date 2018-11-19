import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import { withTheme } from 'emotion-theming';
import { connectGen3, getAccessToken } from 'services/gen3';
import { Gen3UserProvider } from 'services/gen3';
import { DashboardCard } from '../styles';
import CardHeader from 'uikit/Card/CardHeader';
import AccessGate from '../../AccessGate';
import DownloadController from 'icons/DownloadController';
import { applyDefaultStyles } from 'uikit/Core';
import LoadingSpinner from 'uikit/LoadingSpinner';

import Component from 'react-component-component';
import { withApi } from 'services/api';
import { CAVATICA, GEN3 } from 'common/constants';
import Gen3Connected from './Gen3Connected';

import ExternalLink from 'uikit/ExternalLink';
import ExternalLinkIcon from 'react-icons/lib/fa/external-link';
import RightIcon from 'react-icons/lib/fa/angle-right';
import CheckIcon from 'react-icons/lib/fa/check-circle';
import Spinner from 'react-spinkit';
import { WhiteButton, LargeTealActionButton } from 'uikit/Button';
import {
  trackUserInteraction,
  analyticsTrigger,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';

import Info from '../Info';

const ConnectButton = ({ ...props }) => {
  const ExternalLink = applyDefaultStyles(ExternalLinkIcon);
  const RightArrow = applyDefaultStyles(RightIcon);

  return (
    <LargeTealActionButton {...props} maxWidth={160}>
      <ExternalLink size={12} position="relative" right={4} />
      Connect
      <RightArrow size={14} position="relative" left={10} />
    </LargeTealActionButton>
  );
};

const AuthorizedStudies = compose(
  withApi,
  injectState,
  withTheme,
)(({ state: { integrationTokens, loggedInUser }, effects, theme, api, ...props }) => {
  return (
    <Component initialState={{ loading: false, connected: false, badgeNumber: 0 }}>
      {({ setState, state }) => (
        <DashboardCard
          title="Authorized Studies"
          Header={CardHeader}
          badge={state.badgeNumber}
          inactive={!state.connected}
          scrollable
        >
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
                  mt={'30px'}
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
                  <Info
                    link={{
                      url:
                        'https://kidsfirstdrc.org/support/studies-and-access/#applying-for-data-access',
                      text: 'applying for data access.',
                    }}
                  />
                </AccessGate>
              )
            }
          />
        </DashboardCard>
      )}
    </Component>
  );
});

export default AuthorizedStudies;
