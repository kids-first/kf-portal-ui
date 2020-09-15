/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import IntegrationItem from './IntegrationItem';
import { compose, setPropTypes } from 'recompose';

class IntegrationManager extends React.Component {
  state = {
    connecting: false,
    errorConnect: null,
    errorDisconnect: null,
  };

  setConnecting = (isConnecting) => this.setState({ connecting: isConnecting });

  setErrorConnect = (error) => this.setState({ errorConnect: error });

  setErrorDisConnect = (error) => this.setState({ errorDisconnect: error });

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

  onClickResetErrors = () => this.setState({ errorConnect: null, errorDisconnect: null });

  render() {
    const { connecting, errorConnect, errorDisconnect } = this.state;
    const {
      logo,
      description,
      isConnected,
      isLoadingBeforeConnecting,
      actionWhenConnected,
      fence,
    } = this.props;

    const { buttonIcon, buttonLabel, modalId } = actionWhenConnected;

    return (
      <IntegrationItem
        fence={fence}
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
          modalId: modalId,
          icon: buttonIcon,
          label: buttonLabel,
        }}
      />
    );
  }
}

const Enhanced = compose(
  setPropTypes({
    fence: PropTypes.string,
    logo: PropTypes.node.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    isConnected: PropTypes.bool,
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
      modalId: PropTypes.string.isRequired,
      buttonIcon: PropTypes.element.isRequired,
      buttonLabel: PropTypes.string.isRequired,
    }),
    modalExtraProps: PropTypes.object,
  }),
)(IntegrationManager);

export default Enhanced;
