import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';

import { Trans } from 'react-i18next';

import IntegrationTableItem from 'components/UserProfile/UserIntegrations/IntegrationTableItem';
import Row from 'uikit/Row';

import { get } from 'lodash';

import {
  fenceConnect,
  getAccessToken,
  deleteFenceTokens,
  convertTokenToUser,
} from 'services/fence';
import FenceAuthorizedStudies from 'components/Fence/FenceAuthorizedStudies';
import { withApi } from 'services/api';

import {
  ConnectButton,
  AuthorizedStudiesButton,
  DisconnectButton,
} from 'components/UserProfile/UserIntegrations/ui';
import LoadingSpinner from 'uikit/LoadingSpinner';
import {
  trackUserInteraction,
  analyticsTrigger,
  setUserDimension,
  TRACKING_EVENTS,
} from 'services/analyticsTracking';

const trackFenceAction = ({ fence, fenceDetails, category, action, label }) => {
  if (fence) {
    let gaDimension = null;

    switch (fence) {
      case 'gen3':
        // authorizedStudies
        gaDimension = '5';
        break;
      case 'cavatica':
        // userCavaticaProjects
        gaDimension = '6';
        break;
      case 'dcf':
        // userDCFdetails
        gaDimension = '7';
        break;
      default:
        break;
    }

    setUserDimension(`dimension${gaDimension}`, fenceDetails);
  }

  trackUserInteraction({ category, action, label });
};

const enhanceActions = compose(
  withApi,
  injectState,
);

const Actions = enhanceActions(
  ({ fence, state: { fenceConnections }, api, effects, loading, setConnecting, connected }) => {
    return loading ? (
      <LoadingSpinner height={48} />
    ) : connected ? (
      <Row>
        <AuthorizedStudiesButton
          onClick={() =>
            viewDetails({ fence, fenceUser: get(fenceConnections, fence, {}), effects })
          }
        />
        <DisconnectButton
          style={{ marginLeft: 10 }}
          onClick={() => disconnect({ fence, api, setConnecting, effects })}
        />
      </Row>
    ) : (
      <ConnectButton onClick={() => connect({ fence, api, setConnecting, effects })} />
    );
  },
);

const actions = ({ ...props }) => {
  return <Actions {...props} />;
};

const viewDetails = ({ fence, fenceUser, effects }) =>
  effects.setModal({
    title: 'Authorized Studies',
    component: (
      <FenceAuthorizedStudies
        fence={fence}
        fenceUser={fenceUser}
        onComplete={effects.unsetModal}
        onCancel={effects.unsetModal}
      />
    ),
  });

const disconnect = async ({ fence, api, setConnecting, effects }) => {
  setConnecting(true);
  await deleteFenceTokens(api, fence);
  await effects.setIntegrationToken(fence, null);
  await effects.removeFenceConnection(fence);
  trackFenceAction({
    fence,
    fenceDetails: '',
    category: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.disconnected,
    label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
  });
  setConnecting(false);
};

const connect = ({ fence, api, setConnecting, effects }) => {
  analyticsTrigger({
    property: 'portal',
    type: 'recording',
    uiArea: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.init,
    label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
  });
  setConnecting(true);
  fenceConnect(api, fence)
    .then(() => getAccessToken(api, fence))
    .then(token => {
      effects.setIntegrationToken(fence, token);
      const details = convertTokenToUser(token);
      effects.addFenceConnection({ fence, details });
      effects.fetchFenceStudies({ api, fence, details });
      setConnecting(false);
      effects.setToast({
        id: `${Date.now()}`,
        action: 'success',
        component: (
          <Row>
            <Trans>Controlled dataset access sucessfully connected.</Trans>
          </Row>
        ),
      });
      trackFenceAction({
        fence,
        fenceDetails: JSON.stringify(details),
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.connected,
        label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
      });
    })
    .catch(err => {
      console.log('err: ', err);
      setConnecting(false);
      trackFenceAction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.failed,
        label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
      });
    });
};

const enhance = compose(
  injectState,
  withState('connecting', 'setConnecting', false),
);

export default enhance(
  ({
    fence,
    logo = () => null,
    description = () => null,
    fenceUser,
    state: { fenceConnectionsInitialized, fenceConnections },
    connecting,
    setConnecting,
    ...props
  }) => {
    const connected = !!get(fenceConnections, fence, false);
    const loading = !fenceConnectionsInitialized || connecting;
    return (
      <IntegrationTableItem
        connected={connected}
        logo={logo()}
        description={description()}
        actions={actions({ fence, connected, loading, setConnecting })}
        {...props}
      />
    );
  },
);
