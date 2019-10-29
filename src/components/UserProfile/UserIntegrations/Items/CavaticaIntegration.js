import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';

import cavaticaLogo from 'assets/logo-cavatica.svg';
import { CAVATICA } from 'common/constants';
import { cavaticaWebRoot } from 'common/injectGlobals';

import ExternalLink from 'uikit/ExternalLink';
import Row from 'uikit/Row';
import CavaticaConnectModal from 'components/cavatica/CavaticaConnectModal';
import IntegrationTableItem from 'components/UserProfile/UserIntegrations/IntegrationTableItem';
import {
  ConnectButton,
  EditButton,
  DisconnectButton,
} from 'components/UserProfile/UserIntegrations/ui';

import { deleteSecret } from 'services/secrets';
import { analyticsTrigger, TRACKING_EVENTS } from 'services/analyticsTracking';
import { isValidKey } from 'services/cavatica';

const edit = ({ effects }) => {
  effects.setModal({
    title: 'How to Connect to Cavatica',
    component: (
      <CavaticaConnectModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} />
    ),
  });
};

const disconnect = async ({ effects }) => {
  await deleteSecret({ service: CAVATICA });
  effects.setIntegrationToken(CAVATICA, null);
};
const connect = ({ effects }) => {
  analyticsTrigger({
    property: 'portal',
    type: 'recording',
    uiArea: TRACKING_EVENTS.categories.user.profile,
    action: TRACKING_EVENTS.actions.integration.init,
    label: TRACKING_EVENTS.labels.cavatica,
  });
  effects.setModal({
    title: 'How to Connect to Cavatica',
    component: (
      <CavaticaConnectModal onComplete={effects.unsetModal} onCancel={effects.unsetModal} />
    ),
  });
};

const Actions = ({ connected, effects }) => {
  return connected ? (
    <Row>
      <EditButton onClick={() => edit({ effects })} />
      <DisconnectButton style={{ marginLeft: 10 }} onClick={() => disconnect({ effects })} />
    </Row>
  ) : (
    <ConnectButton onClick={() => connect({ effects })} />
  );
};

const actions = ({ ...props }) => {
  return <Actions {...props} />;
};

const description = () => {
  return (
    <span>
      {'Analyze data quickly by connecting your account to the cloud compute environment,  '}
      <ExternalLink href={cavaticaWebRoot}>Cavatica</ExternalLink>.
    </span>
  );
};

const logo = () => {
  return <img src={cavaticaLogo} alt="Cavatica Logo" />;
};

const enhance = compose(injectState);
export default enhance(({ state: { integrationTokens }, effects, props }) => {
  const connected = isValidKey(integrationTokens[CAVATICA]);
  return (
    <IntegrationTableItem
      connected={connected}
      logo={logo()}
      description={description()}
      actions={actions({ connected, effects })}
    />
  );
});
