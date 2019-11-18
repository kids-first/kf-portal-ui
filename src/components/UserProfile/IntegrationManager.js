import React from 'react';
import PropTypes from 'prop-types';
import IntegrationItem from './IntegrationItem';
import { compose, setPropTypes } from 'recompose';
import { withRouter } from 'react-router';

class IntegrationManager extends React.Component {
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

  onClickConnect = () => {
    this.setState({ errorConnect: null });
    const { connection } = this.props;
    const { connectCb, connectCbParams } = connection;
    return connectCb({
      ...connectCbParams,
      setConnecting: this.setConnecting,
      setError: this.setErrorConnect,
    });
  };

  onClickDisconnect = () => {
    this.setState({ errorDisconnect: null });
    const { disConnection } = this.props;
    const { disConnectCb, disConnectCbParams } = disConnection;
    return disConnectCb({
      ...disConnectCbParams,
      setConnecting: this.setConnecting,
      setError: this.setErrorDisConnect,
    });
  };

  onClickResetErrors = () => {
    return this.setState({ errorConnect: null, errorDisconnect: null });
  };

  onClickActionButton = () => {
    const { actionCb, actionCbParam } = this.props.actionWhenConnected;
    return actionCb(actionCbParam);
  };

  render() {
    const { connecting, errorConnect, errorDisconnect } = this.state;
    const {
      logo,
      description,
      isConnected,
      isLoadingBeforeConnecting,
      actionWhenConnected,
    } = this.props;

    const { buttonIcon, buttonLabel } = actionWhenConnected;

    return (
      <IntegrationItem
        logo={logo}
        description={description}
        connected={isConnected}
        loading={isLoadingBeforeConnecting || connecting}
        onClickConnectCb={this.onClickConnect}
        onClickDisconnectCb={this.onClickDisconnect}
        errorConnect={errorConnect}
        errorDisconnect={errorDisconnect}
        onClickResetErrorsCb={this.onClickResetErrors}
        actionButtonWhenConnected={{
          onClick: this.onClickActionButton,
          icon: buttonIcon,
          label: buttonLabel,
        }}
      />
    );
  }
}

const Enhanced = compose(
  withRouter,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    isConnected: PropTypes.bool.isRequired,
    isLoadingBeforeConnecting: PropTypes.bool.isRequired,
    connection: PropTypes.shape({
      connectCb: PropTypes.func.isRequired,
      connectCbParams: PropTypes.object.isRequired,
    }).isRequired,
    disConnection: PropTypes.shape({
      disConnectCb: PropTypes.func.isRequired,
      disConnectCbParams: PropTypes.object.isRequired,
    }).isRequired,
    actionWhenConnected: PropTypes.shape({
      actionCb: PropTypes.func.isRequired,
      actionCbParam: PropTypes.object.isRequired,
      buttonIcon: PropTypes.string.isRequired,
      buttonLabel: PropTypes.string.isRequired,
    }),
  }),
)(IntegrationManager);

export default Enhanced;
