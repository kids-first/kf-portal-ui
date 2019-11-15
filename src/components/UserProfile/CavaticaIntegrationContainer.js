import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { injectState } from 'freactal';
import IntegrationItem from './IntegrationItem';
import { analyticsTrigger, TRACKING_EVENTS } from 'services/analyticsTracking';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import { deleteSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { isValidKey } from 'services/cavatica';

const edit = ({ effects }) => {
  effects.setModal({
    title: 'How to Connect to Cavatica',
    component: (
      <CavaticaConnectModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} />
    ),
  });
};

const disconnect = async ({ effects, setConnecting, setError }) => {
  setConnecting(true);

  try {
    await deleteSecret({ service: CAVATICA });
    effects.setIntegrationToken(CAVATICA, null);
  } catch (e) {
    setError(e);
  }

  setConnecting(false);
};
const connect = ({ effects, setConnecting }) => {
  setConnecting(true);
  analyticsTrigger({
    property: 'portal',
    type: 'recording',
    uiArea: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.init,
    label: TRACKING_EVENTS.labels.cavatica,
  });
  edit({ effects });
  setConnecting(false);
};

class CavaticaIntegrationContainer extends React.Component {
  state = {
    connecting: false,
    errorDisconnect: null,
  };

  setConnecting = isConnecting => {
    return this.setState({ connecting: isConnecting });
  };

  setErrorDisConnect = error => {
    return this.setState({ errorDisconnect: error });
  };

  onClickResetErrors = () => {
    return this.setState({ errorConnect: null, errorDisconnect: null });
  };

  onClickDisconnect = () => {
    this.setState({ errorDisconnect: null });
    const { effects } = this.props;
    return disconnect({
      setConnecting: this.setConnecting,
      effects,
      setError: this.setErrorDisConnect,
    });
  };

  onClickEdit = () => {
    const { effects } = this.props;
    return edit({ effects });
  };

  onClickConnect = () => {
    const { effects } = this.props;
    return connect({
      setConnecting: this.setConnecting,
      effects,
    });
  };

  render() {
    const {
      state: { integrationTokens },
      logo,
      description,
      history,
    } = this.props;

    const { connecting, errorDisconnect } = this.state;

    return (
      <IntegrationItem
        logo={logo}
        description={description}
        connected={isValidKey(integrationTokens[CAVATICA])}
        loading={connecting}
        onClickDisconnectCb={this.onClickDisconnect}
        onClickConnectCb={this.onClickConnect}
        errorDisconnect={errorDisconnect}
        history={history}
        onClickResetErrorsCb={this.onClickResetErrors}
        actionButtonWhenConnected={{
          onClick: this.onClickEdit,
          icon: 'edit',
          label: 'Edit',
        }}
      />
    );
  }
}

const Enhanced = compose(
  injectState,
  withRouter,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    connecting: PropTypes.bool,
    state: PropTypes.object.isRequired,
    effects: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    actionButtonWhenConnected: PropTypes.shape({
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  }),
)(CavaticaIntegrationContainer);

export default Enhanced;
