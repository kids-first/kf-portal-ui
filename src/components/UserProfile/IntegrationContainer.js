import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { injectState } from 'freactal';
import { withApi } from 'services/api';
import IntegrationItem from './IntegrationItem';
import Row from 'uikit/Row'; //TODO swap with antd
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
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

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

const disconnect = async ({ fence, api, setConnecting, effects, setError }) => {
  setConnecting(true);
  try {
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
        component: <Row>Controlled dataset access sucessfully connected.</Row>,
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

class IntegrationContainer extends React.Component {
  state = {
    connecting: false,
    errorConnect: null,
    errorDisconnect: null,
  };

  setConnecting = isConnecting => {
    return this.setState({ connecting: isConnecting });
  };

  setErrorConnect = error => {
    return this.setState({ errorConnect: error });
  };

  setErrorDisConnect = error => {
    return this.setState({ errorDisconnect: error });
  };

  onClickResetErrors = () => {
    return this.setState({ errorConnect: null, errorDisconnect: null });
  };

  onClickAuthorizedStudies = () => {
    const { fence, fenceConnections, effects } = this.props;
    return viewDetails({ fence, fenceUser: get(fenceConnections, fence, {}), effects });
  };
  onClickDisconnect = () => {
    this.setState({ errorDisconnect: null });
    const { fence, api, effects } = this.props;
    return disconnect({
      fence,
      api,
      setConnecting: this.setConnecting,
      effects,
      setError: this.setErrorDisConnect,
    });
  };

  onClickConnect = () => {
    this.setState({ errorConnect: null });
    const { fence, effects, api } = this.props;
    return connect({
      fence,
      api,
      setConnecting: this.setConnecting,
      effects,
      setError: this.setErrorConnect,
    });
  };

  render() {
    const {
      fence,
      state: { fenceConnectionsInitialized, fenceConnections },
      logo,
      description,
      history,
    } = this.props;

    const { connecting, errorConnect, errorDisconnect } = this.state;
    const connected = !!get(fenceConnections, fence, false);
    const loading = !fenceConnectionsInitialized || connecting;
    return (
      <IntegrationItem
        logo={logo}
        description={description}
        connected={connected}
        loading={loading}
        onClickAuthorizedStudiesCb={this.onClickAuthorizedStudies}
        onClickDisconnectCb={this.onClickDisconnect}
        onClickConnectCb={this.onClickConnect}
        errorConnect={errorConnect}
        errorDisconnect={errorDisconnect}
        history={history}
        onClickResetErrorsCb={this.onClickResetErrors}
        actionButtonWhenConnected={{
          onClick: this.onClickAuthorizedStudies,
          icon: 'book',
          label: 'Authorized studies',
        }}
      />
    );
  }
}

const Enhanced = compose(
  injectState,
  fenceConnectionInitializeHoc,
  withRouter,
  withApi,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.string.isRequired,
    connecting: PropTypes.bool,
    fence: PropTypes.string.isRequired,
    state: PropTypes.object.isRequired,
    effects: PropTypes.object.isRequired,
    api: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    actionButtonWhenConnected: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  }),
)(IntegrationContainer);

export default Enhanced;
