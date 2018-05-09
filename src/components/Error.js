import React from 'react';
import { Trans } from 'react-i18next';

import SplashPage from 'components/SplashPage';

export default () => (
  <SplashPage>
    <div
      css={`
        text-align: center;
      `}
    >
      <Trans>An error has occurred, please try again later</Trans>
    </div>
  </SplashPage>
);
