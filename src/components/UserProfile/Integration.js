import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { injectState } from 'freactal';
import { withApi } from 'services/api';
import { get } from 'lodash';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import {
  convertTokenToUser,
  deleteFenceTokens,
  fenceConnect,
  getAccessToken,
} from 'services/fence';
import FenceAuthorizedStudies from 'components/Fence/FenceAuthorizedStudies';
import {
  analyticsTrigger,
  setUserDimension,
  TRACKING_EVENTS,
  trackUserInteraction,
} from 'services/analyticsTracking';
import PropTypes from 'prop-types';
import IntegrationManager from './IntegrationManager';

const AUTHORIZED_STUDIES_DIM = '5';
const CAVATICA_DIM = '6';
const DCF_DIM = '7';

const trackFenceAction = async ({ fence, fenceDetails, category, action, label }) => {
  if (fence) {
    let gaDimension = null;

    switch (fence) {
      case 'gen3':
        // authorizedStudies
        gaDimension = AUTHORIZED_STUDIES_DIM;
        break;
      case 'cavatica':
        // userCavaticaProjects
        gaDimension = CAVATICA_DIM;
        break;
      case 'dcf':
        // userDCFdetails
        gaDimension = DCF_DIM;
        break;
      default:
        break;
    }

    setUserDimension(`dimension${gaDimension}`, fenceDetails);
  }

  await trackUserInteraction({ category, action, label });
};

const viewDetails = ({ fence, fenceUser, effects }) => {
  return effects.setModal({
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
};

const disconnect = async ({ fence, api, setConnecting, effects, setError }) => {
  setConnecting(true);
  try {
    await deleteFenceTokens(api, fence);
    await effects.setIntegrationToken(fence, null);
    await effects.removeFenceConnection(fence);
    await trackFenceAction({
      fence,
      fenceDetails: '',
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.disconnected,
      label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
    });
  } catch (e) {
    setError(e);
  }
  setConnecting(false);
};

const connect = ({ fence, api, setConnecting, effects, setError }) => {
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
        component: <div>Controlled dataset access sucessfully connected.</div>,
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
      setError(err);
      setConnecting(false);
      trackFenceAction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.failed,
        label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
      });
    });
};

function Integration(props) {
  const {
    fence,
    state: { fenceConnectionsInitialized, fenceConnections },
    logo,
    description,
    effects,
    api,
  } = props;

  return (
    <IntegrationManager
      logo={logo}
      description={description}
      isConnected={!!get(fenceConnections, fence, false)}
      isLoadingBeforeConnecting={!fenceConnectionsInitialized}
      actionWhenConnected={{
        actionCb: viewDetails,
        actionCbParam: { fence, fenceUser: get(fenceConnections, fence, {}), effects },
        buttonIcon: 'book',
        buttonLabel: 'View studies',
      }}
      connection={{
        connectCb: connect,
        connectCbParams: {
          fence,
          api,
          effects,
        },
      }}
      disConnection={{
        disConnectCb: disconnect,
        disConnectCbParams: {
          fence,
          api,
          effects,
        },
      }}
    />
  );
}

const Enhanced = compose(
  injectState,
  fenceConnectionInitializeHoc,
  withApi,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    connecting: PropTypes.bool,
    fence: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    effects: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
    actionButtonWhenConnected: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  }),
)(Integration);

export default Enhanced;
