import React from 'react';
import { Trans } from 'react-i18next';

import ExternalLink from 'uikit/ExternalLink';

import FenceIntegrationItem from 'components/UserProfile/UserIntegrations/FenceIntegrationItem';

import { GEN3 } from 'common/constants';
import gen3Logo from 'assets/logo-gen3-kf-data-catalog.svg';
import { gen3WebRoot } from 'common/injectGlobals';

const description = () => {
  return (
    <span>
      <Trans>Access all released Kids First controlled access data by connecting your account using your NIH login credentials.</Trans>
    </span>
  );
};

const logo = () => {
  return <img src={gen3Logo} alt="Gen3 Logo" />;
};

export default ({ ...props }) => {
  const itemProps = { fence: GEN3, logo, description, ...props };
  return <FenceIntegrationItem {...itemProps} />;
};
