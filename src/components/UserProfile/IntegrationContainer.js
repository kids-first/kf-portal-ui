import React from 'react';
import { compose } from 'recompose';
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
      console.log('err: ', err);
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
  };

  setConnecting = isConnecting => {
    return this.setState({ connecting: isConnecting });
  };

  onChange = checked => {
    const { fence, api, effects } = this.props;
    if (checked) {
      return connect({ fence, api, setConnecting: this.setConnecting, effects });
    }
    return disconnect({ fence, api, setConnecting: this.setConnecting, effects });
  };

  onClickAuthorizedStudies = () => {
    const { fence, fenceConnections, effects } = this.props;
    return viewDetails({ fence, fenceUser: get(fenceConnections, fence, {}), effects });
  };
  onClickDisconnect = () => {
    const { fence, api, effects } = this.props;
    return disconnect({ fence, api, setConnecting: this.setConnecting, effects });
  };

  onClickConnect = () => {
    const { fence, effects, api } = this.props;
    return connect({ fence, api, setConnecting: this.setConnecting, effects });
  };

  render() {
    const {
      fence,
      state: { fenceConnectionsInitialized, fenceConnections },
      logo,
      description,
    } = this.props;

    const { connecting } = this.state;

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
      />
    );
  }
}

const Enhanced = compose(
  withApi,
  fenceConnectionInitializeHoc,
  injectState,
)(IntegrationContainer);

Enhanced.propTypes = {
  logo: PropTypes.node.isRequired,
  description: PropTypes.string.isRequired,
  connecting: PropTypes.bool,
  fence: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  effects: PropTypes.object.isRequired,
  api: PropTypes.func.isRequired,
};

export default Enhanced;
