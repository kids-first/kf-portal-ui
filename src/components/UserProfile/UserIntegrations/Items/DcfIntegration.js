import React from 'react';
import { Trans } from 'react-i18next';

import FenceIntegrationItem from 'components/UserProfile/UserIntegrations/FenceIntegrationItem';
import ExternalLink from 'uikit/ExternalLink';

import { DCF } from 'common/constants';
import dcfLogo from 'assets/logo-dcf.png';
import { dcfWebRoot } from 'common/injectGlobals';

const description = () => {
  return (
    <span>
      <Trans>Access controlled data by connecting your account to the</Trans>
      <ExternalLink href={dcfWebRoot}>
        <Trans>Data Commons Framework (DCF)</Trans>
      </ExternalLink>{' '}
      <Trans>using your NIH login credentials.</Trans>
    </span>
  );
};

const logo = () => {
  return <img src={dcfLogo} alt="Data Commons Framework Logo" />;
};

export default ({ ...props }) => {
  const itemProps = { fence: DCF, logo, description, ...props };
  return <FenceIntegrationItem {...itemProps} />;
};
