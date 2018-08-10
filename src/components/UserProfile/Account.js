import * as React from 'react';
import { compose, withState } from 'recompose';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';

import { H2 } from './ui';
import UserIntegrations from './UserIntegrations';
import ConnectedWithBadge from './ConnectedWithBadge';

import { Box } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Input from 'uikit/Input';

const SettingsSection = x => <Column justifyContent="stretch" w="100%" pb={4} {...x} />;

export default compose(
  injectState,
  withState('mode', 'setMode', 'account'),
)(({ profile, submit, mode, setMode, state: { loginProvider } }) => (
  <Box w="70%" pr={4} pl={0}>
    <SettingsSection>
      <H2>
        <Trans>Settings</Trans>
      </H2>
      <Column>
        Email Address:
        <Row alignItems="center" mt={2}>
          <Input disabled value={profile.email} />
          <Box ml={3}>
            <ConnectedWithBadge provider={loginProvider} />
          </Box>
        </Row>
      </Column>
    </SettingsSection>

    <SettingsSection>
      <H2>Integrations</H2>
      <UserIntegrations />
    </SettingsSection>
  </Box>
));
