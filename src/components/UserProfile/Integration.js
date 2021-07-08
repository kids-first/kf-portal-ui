/* eslint-disable react/prop-types */
import React from 'react';
import { connect as reduxConnect } from 'react-redux';
import { BookOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { injectState } from 'freactal';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { compose, setPropTypes } from 'recompose';

import useFenceConnections from 'hooks/useFenceConnections';
import {
  setUserDimension,
  TRACKING_EVENTS,
  trackUserInteraction,
} from 'services/analyticsTracking';
import { withApi } from 'services/api';
import {
  convertTokenToUser,
  deleteFenceTokens,
  fenceConnect,
  getAccessToken,
} from 'services/fence';
import { addFenceConnection } from 'store/actionCreators/fenceConnections';
import { removeFenceConnection } from 'store/actionCreators/fenceConnections';
import { computeAclsForConnection } from 'store/actionCreators/fenceConnections';
import { fetchFenceStudiesIfNeeded } from 'store/actionCreators/fenceStudies';
import { removeFenceStudies } from 'store/actionCreators/fenceStudies';

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

const disconnect = async ({
  fence,
  api,
  setConnecting,
  effects,
  setError,
  removeFenceConnection,
  removeFenceStudies,
}) => {
  setConnecting(true);
  try {
    await deleteFenceTokens(api, fence);
    await effects.setIntegrationToken(fence, null);
    removeFenceConnection(fence);
    removeFenceStudies(fence);
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

const connect = async ({
  fence,
  api,
  setConnecting,
  effects,
  setError,
  fetchFenceStudiesIfNeeded,
  addFenceConnection,
}) => {
  setConnecting(true);
  try {
    await fenceConnect(api, fence);
    const token = await getAccessToken(api, fence);
    effects.setIntegrationToken(fence, token);
    const details = convertTokenToUser(token);
    addFenceConnection(fence, details);
    fetchFenceStudiesIfNeeded(api, fence, computeAclsForConnection(details));
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
    addFenceConnection,
    fetchFenceStudiesIfNeeded,
    removeFenceConnection,
    removeFenceStudies,
    fence,
    logo,
    description,
    effects,
    api,
  } = props;

  const {
    isCheckingIfFenceConnectionsFetchIsNeeded,
    isFetchingAllFenceConnections,
    fenceConnections,
  } = useFenceConnections(api, [fence]);
  const isLoadingFence = isCheckingIfFenceConnectionsFetchIsNeeded || isFetchingAllFenceConnections;

  return (
    <IntegrationManager
      fence={fence}
      logo={logo}
      description={description}
      isConnected={!!get(fenceConnections, fence, false)}
      isLoadingBeforeConnecting={isLoadingFence}
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
          addFenceConnection,
          fetchFenceStudiesIfNeeded,
        },
      }}
      disConnection={{
        disConnectCb: disconnect,
        disConnectCbParams: {
          fence,
          api,
          effects,
          removeFenceConnection,
          removeFenceStudies,
        },
      }}
    />
  );
}

const mapDispatchToProps = (dispatch) => ({
  addFenceConnection: (fenceName, connection) =>
    dispatch(addFenceConnection(fenceName, connection)),
  fetchFenceStudiesIfNeeded: (api, fenName, acls) =>
    dispatch(fetchFenceStudiesIfNeeded(api, fenName, acls)),
  removeFenceConnection: (fenceName) => dispatch(removeFenceConnection(fenceName)),
  removeFenceStudies: (fenceName) => dispatch(removeFenceStudies(fenceName)),
});

const connector = reduxConnect(null, mapDispatchToProps);

const Enhanced = compose(
  connector,
  injectState,
  withApi,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    connecting: PropTypes.bool,
    fence: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    effects: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
    addFenceConnection: PropTypes.func,
    fetchFenceStudiesIfNeeded: PropTypes.func,
    removeFenceConnection: PropTypes.func,
    removeFenceStudies: PropTypes.func,
  }),
)(Integration);

export default Enhanced;
