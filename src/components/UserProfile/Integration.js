/* eslint-disable react/prop-types */
import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { injectState } from 'freactal';
import { withApi } from 'services/api';
import get from 'lodash/get';
import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import {
  convertTokenToUser,
  deleteFenceTokens,
  fenceConnect,
  getAccessToken,
} from 'services/fence';
import {
  analyticsTrigger,
  setUserDimension,
  TRACKING_EVENTS,
  trackUserInteraction,
} from 'services/analyticsTracking';
import PropTypes from 'prop-types';
import IntegrationManager from './IntegrationManager';
import { BookOutlined } from '@ant-design/icons';
import { notification } from 'antd';

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

const connect = async ({ fence, api, setConnecting, effects, setError }) => {
  analyticsTrigger({
    property: 'portal',
    type: 'recording',
    uiArea: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.init,
    label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
  });
  setConnecting(true);
  try {
    await fenceConnect(api, fence);
    const token = await getAccessToken(api, fence);
    effects.setIntegrationToken(fence, token);
    const details = convertTokenToUser(token);
    effects.addFenceConnection({ fence, details });
    await effects.fetchFenceStudies({ api, fence, details });
    setConnecting(false);
    notification.success({
      message: 'Success',
      description: ' Controlled dataset access sucessfully connected.',
      duration: 10,
    });
    await trackFenceAction({
      fence,
      fenceDetails: JSON.stringify(details),
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.connected,
      label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
    });
  } catch (e) {
    setError(e);
    setConnecting(false);
    await trackFenceAction({
      category: TRACKING_EVENTS.categories.user.profile,
      action: TRACKING_EVENTS.actions.integration.failed,
      label: TRACKING_EVENTS.labels[fence] ? TRACKING_EVENTS.labels[fence] : fence,
    });
  }
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
      fence={fence}
      logo={logo}
      description={description}
      isConnected={!!get(fenceConnections, fence, false)}
      isLoadingBeforeConnecting={!fenceConnectionsInitialized}
      actionWhenConnected={{
        modalId: fence,
        buttonIcon: <BookOutlined />,
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
  }),
)(Integration);

export default Enhanced;
