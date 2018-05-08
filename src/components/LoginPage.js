import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { Trans } from 'react-i18next';
import { withApi } from '../services/api';

import Login from 'components/Login';

const LoginPage = compose(withRouter, withTheme, withApi)(({ history, location, theme, api }) => (
  <div
    css={`
      width: 630px;
      margin: auto;
    `}
  >
    <h1
      css={`
        background-image: linear-gradient(to right, #404c9a, #009bb8 51%, #02b0ed),
          linear-gradient(#2b388f, #2b388f);
        font-family: Montserrat;
        font-size: 36px;
        font-weight: 500;
        margin: 10px 0;
        letter-spacing: 0.5px;
        text-align: center;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      `}
    >
      <Trans>Kids First Data Resource Portal</Trans>
    </h1>
    <div css={theme.card}>
      <h2 css={theme.h2}>
        <Trans>Log in</Trans>
      </h2>

      <Login
        api={api}
        shouldNotRedirect={true}
        onFinish={user => {
          if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
            history.push('/join');
          } else if (['/', '/join'].includes(location.pathname)) {
            history.push('/dashboard');
          }
        }}
      />
      <div
        css={`
          ${theme.section};
          text-align: center;
          border-top: 1px solid ${theme.greyScale8};
          margin-top: 10px;
          padding: 10px 10px 0 10px;
        `}
      >
        <Trans>New to Kids First Data Resource Portal?</Trans>{' '}
        <Link to="/join">
          <Trans>Join now</Trans>
          <RightIcon />
        </Link>
      </div>
    </div>
  </div>
));
export default LoginPage;
