import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import RightIcon from 'react-icons/lib/fa/angle-right';

import Login from 'components/Login';

const LoginPage = compose(withRouter, withTheme)(({ history, location, theme }) => (
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
        line-height: 0.72;
        letter-spacing: 0.5px;
        text-align: center;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      `}
    >
      Kids First Data Resource Portal
    </h1>
    <div css={theme.card}>
      <h2 css={theme.h2}>Log in</h2>

      <Login
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
        New to Kids First?{' '}
        <Link to="/join">
          Join now<RightIcon />
        </Link>
      </div>
    </div>
  </div>
));
export default LoginPage;
