import React from 'react';
import { Trans } from 'react-i18next';

import FenceIntegrationItem from 'components/UserProfile/UserIntegrations/FenceIntegrationItem';

import { GEN3 } from 'common/constants';
import kfFrameworkServicesLogo from 'assets/kids-first-framework-services.svg';
import { gen3WebRoot } from 'common/injectGlobals';
import { css } from 'emotion';

const linkCss = css({
  width: '140px',
  textAlign: 'center',
  marginTop: '10px',
});

const description = () => {
  return (
    <span>
      <Trans>
        Access all released Kids First controlled access data by connecting your account using your
        NIH login credentials.
      </Trans>
    </span>
  );
};

const logo = () => {
  return (
    <a href={gen3WebRoot} className={`${linkCss}`} target="_blank">
      <img src={kfFrameworkServicesLogo} alt="Gen3 Logo" height="30px" />
    </a>
  );
};

export default ({ ...props }) => {
  const itemProps = { fence: GEN3, logo, description, ...props };
  return <FenceIntegrationItem {...itemProps} />;
};
