import React from 'react';

import IntegrationTableItem from '../IntegrationTableItem';
import { withTheme } from 'emotion-theming';

import { Span, Paragraph, Div } from 'uikit/Core';
import ExternalLink from 'uikit/ExternalLink';
import LoadingSpinner from 'uikit/LoadingSpinner';

import cavaticaLogo from 'assets/logo-cavatica.svg';
import { cavaticaWebRoot } from 'common/injectGlobals';
import { ConnectButton } from 'components/UserProfile/UserIntegrations/ui';

const actions = () => {
  return <ConnectButton onClick={() => alert('Placeholder! Not Connecting!')} />;
};

const description = () => {
  return (
    <span>
      Analyze data quickly by connecting your account to the cloud compute environment,{' '}
      <ExternalLink href={cavaticaWebRoot}>Cavatica</ExternalLink>.
    </span>
  );
};

const logo = () => {
  return <img src={cavaticaLogo} alt="Cavatica Logo" />;
};

export default ({ ...props }) => {
  return <IntegrationTableItem logo={logo()} description={description()} actions={actions()} />;
};
