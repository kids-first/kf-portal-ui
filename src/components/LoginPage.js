import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withTheme } from 'emotion-theming';
import RightIcon from 'react-icons/lib/fa/angle-right';
import { withApi } from '../services/api';

import Login from 'components/Login';
import SplashPage from 'components/SplashPage';

import { Link, Section } from 'uikit/Core';

import './Login/index.css';

const LoginPage = compose(
  withRouter,
  withTheme,
  withApi,
)(({ history, location, theme, api, stealth = false }) => (
  <SplashPage stealth={stealth}>
    {stealth ? null : (
      <h2 className="loginH2" mt="9px" mb={0}>
        Log in
      </h2>
    )}

    <Login
      api={api}
      shouldNotRedirect={true}
      onFinish={user => {
        if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
          history.push('/join');
        } else if (['/', '/join', '/orcid'].includes(location.pathname)) {
          history.push('/dashboard');
        }
      }}
    />

    {stealth ? null : (
      <Section className="loginJoinMessage">
        {'New to Kids First Data Resource Portal? '}
        <Link to="/join" className="bare primary bold">
          Join now
          <RightIcon />
        </Link>
      </Section>
    )}
  </SplashPage>
));
export default LoginPage;
