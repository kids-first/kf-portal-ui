import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import RightIcon from 'react-icons/lib/fa/angle-right';

import Login from 'components/Login';

const LoginPage = compose(withRouter, withTheme)(({ history, theme }) => (
  <div
    css={`
      margin: 5% auto 0 auto;
    `}
  >
    <div css={theme.card}>
      <h2 css={theme.h2}>Log in</h2>

      <Login
        shouldNotRedirect={true}
        onFinish={user => {
          if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
            history.push('/join');
          } else {
            history.push('search/file');
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
