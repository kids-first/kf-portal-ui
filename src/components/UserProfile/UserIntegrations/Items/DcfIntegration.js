import React from 'react';
import { Trans } from 'react-i18next';

import FenceIntegrationItem from 'components/UserProfile/UserIntegrations/FenceIntegrationItem';
import { css } from 'emotion';

import { DCF } from 'common/constants';
import dcfLogo from 'assets/logo-dcf.svg';
import { dcfWebRoot } from 'common/injectGlobals';

const linkCss = css({
  width: '140px',
  textAlign: 'center',
  marginTop: '10px',
});

const description = () => {
  return (
    <span>
      <Trans>
        Access select NCI controlled access data by connecting your account using your NIH login
        credentials.
      </Trans>
    </span>
  );
};

const logo = () => {
  return (
    <a href={dcfWebRoot} className={`${linkCss}`} target="_blank">
      <img src={dcfLogo} alt="Data Commons Framework Logo" />
    </a>
  );
};

export default ({ ...props }) => {
  const itemProps = { fence: DCF, logo, description, ...props };
  return <FenceIntegrationItem {...itemProps} />;
};
