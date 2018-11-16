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

import Component from 'react-component-component';
import { withApi } from 'services/api';
import { CAVATICA, GEN3 } from 'common/constants';

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
import Connected from './Connected';
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
  console.log('props', props);
  return (
    <Component initialState={{ loading: false, connected: false }}>
      {({ setState, state }) => (
        <DashboardCard title="Authorized Studies" Header={CardHeader} inactive>
          {state.connected ? (
            <Connected />
          ) : (
            <AccessGate
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
                      effects.setToast({
                        id: `${Date.now()}`,
                        action: 'success',
                        component: (
                          <Row>Controlled dataset access sucessfully connected through Gen3</Row>
                        ),
                      });
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
          )}
        </DashboardCard>
      )}
    </Component>
  );
});

export default AuthorizedStudies;
