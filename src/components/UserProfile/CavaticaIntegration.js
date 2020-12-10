/* eslint-disable react/prop-types */
import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { injectState } from 'freactal';
import PropTypes from 'prop-types';
import { deleteSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { isValidKey } from 'services/cavatica';
import IntegrationManager from 'components/UserProfile/IntegrationManager';
import { EditOutlined } from '@ant-design/icons';
import { connect as ReduxConnect } from 'react-redux';
import { openModal } from 'store/actions/modal';
import { CAVATICA_INTEGRATION_MODAL_ID } from './constants';

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
const connect = ({ setConnecting, openModal }) => {
  setConnecting(true);
  openModal(CAVATICA_INTEGRATION_MODAL_ID);
  setConnecting(false);
};

function CavaticaIntegration(props) {
  const {
    state: { integrationTokens },
    logo,
    description,
    effects,
    openModal,
  } = props;

  return (
    <IntegrationManager
      logo={logo}
      description={description}
      isConnected={isValidKey(integrationTokens[CAVATICA])}
      isLoadingBeforeConnecting={false}
      actionWhenConnected={{
        modalId: CAVATICA_INTEGRATION_MODAL_ID,
        buttonIcon: <EditOutlined />,
        buttonLabel: 'Settings',
      }}
      connection={{
        connectCb: connect,
        connectCbParams: {
          openModal,
        },
      }}
      disConnection={{
        disConnectCb: disconnect,
        disConnectCbParams: {
          effects,
        },
      }}
    />
  );
}

const Enhanced = compose(
  injectState,
  setPropTypes({
    logo: PropTypes.node.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    connecting: PropTypes.bool,
    state: PropTypes.object.isRequired,
    effects: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
  }),
)(CavaticaIntegration);

const mapDispatchToProps = (dispatch) => ({
  openModal: (id) => {
    dispatch(openModal(id));
  },
});

export default ReduxConnect(null, mapDispatchToProps)(Enhanced);
