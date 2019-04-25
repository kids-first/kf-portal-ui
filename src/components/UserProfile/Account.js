import * as React from 'react';
import { compose, withState } from 'recompose';
import { Trans } from 'react-i18next';
import { injectState } from 'freactal';

import { CardHeader } from './ui';
import IntegrationTable from './UserIntegrations/IntegrationTable';
import Gen3Integration from './UserIntegrations/Items/Gen3Integration';
import DcfIntegration from './UserIntegrations/Items/DcfIntegration';
import CavaticaIntegration from './UserIntegrations/Items/CavaticaIntegration';
import ConnectedWithBadge from './ConnectedWithBadge';

import { fenceConnectionInitializeHoc } from 'stateProviders/provideFenceConnections';
import { withApi } from 'services/api';
import { Box } from 'uikit/Core';
import Row from 'uikit/Row';
import Column from 'uikit/Column';
import Input from 'uikit/Input';
import styled from 'react-emotion';
import ExternalLink from 'uikit/ExternalLink';
import { gen3WebRoot } from 'common/injectGlobals';

const CardBody = styled('div')`
  margin: -15px 0 15px 0;
  font-family: Montserrat, sans-serif, sans-serif;
  font-size: 13px;
`;

const SettingsSection = x => <Column justifyContent="stretch" w="100%" pb={4} {...x} />;

export default compose(
  injectState,
  withApi,
  withState('mode', 'setMode', 'account'),
  fenceConnectionInitializeHoc,
)(({ profile, submit, mode, setMode, state: { loginProvider }, ...props }) => (
  <Box style={{ maxWidth: 1050 }} pr={4} pl={0} pt="8px">
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
        <Trans>Data Repository Integrations</Trans>
      </CardHeader>
      <CardBody>
        The Kids First DRC provides the ability to integrate across different data repositories for
        pediatric research. By connecting to each integration (powered by{' '}
        <ExternalLink href={gen3WebRoot}>Gen3</ExternalLink>), you will immediately have the ability
        to analyze the data available from these repositories in Cavatica through this portal.
        Please remember that it is your responsibility to follow any data use limitations with
        controlled access data.
      </CardBody>

      <IntegrationTable>
        <Gen3Integration />
        <DcfIntegration />
      </IntegrationTable>
    </SettingsSection>

    <SettingsSection>
      <CardHeader mt="22px" mb="31px">
        <Trans>Application Integrations</Trans>
      </CardHeader>

      <IntegrationTable>
        <CavaticaIntegration />
      </IntegrationTable>
    </SettingsSection>
  </Box>
));
