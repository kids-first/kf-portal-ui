import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';
import { H1 } from '../uikit/Typography';

const SplashPage = compose(withTheme)(({ theme, children }) => (
  <div
    css={`
      width: 630px;
      margin: auto;
    `}
  >
    <H1 caps center my={10}>
      <Trans>Kids First Data Resource Portal</Trans>
    </H1>

    <div css={theme.card}>{children}</div>
  </div>
));

export default SplashPage;
