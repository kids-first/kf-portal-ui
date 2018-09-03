import * as React from 'react';
import { compose, withState } from 'recompose';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';

import { H2, CardHeader } from './ui';
import UserIntegrations from './UserIntegrations';
import ConnectedWithBadge from './ConnectedWithBadge';

import { Box } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Input from 'uikit/Input';

const SettingsSection = x => <Column justifyContent="stretch" w="100%" pb={4} {...x} />;

export default compose(injectState, withState('mode', 'setMode', 'account'))(
  ({ profile, submit, mode, setMode, state: { loginProvider } }) => (
    <Box w="70%" pr={4} pl={0} pt="8px">
      <SettingsSection>
        <CardHeader mb="43px">
          <Trans>Settings</Trans>
        </CardHeader>
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
        <CardHeader mt="22px" mb="31px">
          <Trans>Integrations</Trans>
        </CardHeader>

        <UserIntegrations />
      </SettingsSection>
    </Box>
  ),
);
