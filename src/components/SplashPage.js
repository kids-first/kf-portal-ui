import React from 'react';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import { Trans } from 'react-i18next';

const SplashPage = compose(withTheme)(({ theme, children, stealth = false }) => (
  <div
    css={`
      width: 630px;
      margin: auto;
    `}
  >
    {stealth ? (
      children
    ) : (
      <React.Fragment>
        <h1
          css={`
            background-image: linear-gradient(to right, #404c9a, #009bb8 51%, #02b0ed),
              linear-gradient(#2b388f, #2b388f);
            font-size: 36px;
            font-weight: 500;
            margin: 10px 0;
            letter-spacing: 0.5px;
            text-align: center;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          `}
        >
          <Trans>Kids First Data Resource Portal</Trans>
        </h1>
        <div css={theme.card}>{children}</div>
      </React.Fragment>
    )}
  </div>
));

export default SplashPage;
