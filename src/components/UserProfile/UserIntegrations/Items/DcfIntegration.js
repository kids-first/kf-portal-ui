import React from 'react';
import { Trans } from 'react-i18next';

import FenceIntegrationItem from 'components/UserProfile/UserIntegrations/FenceIntegrationItem';
import ExternalLink from 'uikit/ExternalLink';

import { DCF } from 'common/constants';
import dcfLogo from 'assets/logo-dcf-2.png';
import { dcfWebRoot } from 'common/injectGlobals';

const description = () => {
  return (
    <span>
      <Trans>Access select NCI controlled access data by connecting your account using your NIH login credentials.</Trans>
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
