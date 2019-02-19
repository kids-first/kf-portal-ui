import React from 'react';

import IntegrationTableItem from '../IntegrationTableItem';
import { withTheme } from 'emotion-theming';

import { Span, Paragraph, Div } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import LoadingSpinner from 'uikit/LoadingSpinner';

import dcfLogo from 'assets/logo-dcf.png';
import { dcfWebRoot } from 'common/injectGlobals';
import { ConnectButton } from 'components/UserProfile/UserIntegrations/ui';

const actions = () => {
  return <ConnectButton onClick={() => alert('Placeholder! Not Connecting!')} />;
};

const description = () => {
  return (
    <span>
      Access controlled data by connecting your account to the{' '}
      <ExternalLink href={dcfWebRoot}>Data Commons Framework (DCF)</ExternalLink> using your NIH
      login credentials.
    </span>
  );
};

const logo = () => {
  return <img src={dcfLogo} alt="Data Commons Framework Logo" />;
};

export default ({ ...props }) => {
  return <IntegrationTableItem logo={logo()} description={description()} actions={actions()} />;
};
