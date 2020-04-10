import React from 'react';
import { compose, setPropTypes } from 'recompose';
import { injectState } from 'freactal';
import { analyticsTrigger, TRACKING_EVENTS } from 'services/analyticsTracking';
import PropTypes from 'prop-types';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import { deleteSecret } from 'services/secrets';
import { CAVATICA } from 'common/constants';
import { isValidKey } from 'services/cavatica';
import IntegrationManager from 'components/UserProfile/IntegrationManager';
import { EditOutlined } from '@ant-design/icons';

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

function CavaticaIntegration(props) {
  const {
    state: { integrationTokens },
    logo,
    description,
    effects,
  } = props;

  return (
    <IntegrationManager
      logo={logo}
      description={description}
      isConnected={isValidKey(integrationTokens[CAVATICA])}
      isLoadingBeforeConnecting={false}
      actionWhenConnected={{
        actionCb: edit,
        actionCbParam: { effects },
        buttonIcon: <EditOutlined />,
        buttonLabel: 'Settings',
      }}
      connection={{
        connectCb: connect,
        connectCbParams: {
          effects,
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
  }),
)(CavaticaIntegration);

export default Enhanced;
