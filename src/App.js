import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser, provideModalState, provideToast } from 'stateProviders';
import { Link, BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import Modal from './components/Modal/index.js';

import Toast from 'uikit/Toast';
import UserProfile from 'components/UserProfile';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'theme/defaultTheme';

import scienceBgPath from 'theme/images/background-science.jpg';
import loginImage from 'assets/smiling-boy-login.jpg';
import joinImage from 'assets/smiling-girl-join-wizard.jpg';
import logoPath from 'theme/images/logo-kids-first-data-portal.svg';

const enhance = compose(provideLoggedInUser, provideModalState, provideToast, injectState);

const Page = ({ Component, backgroundImageUrl, ...props }) => (
  <div
    css={`
      position: relative;
      min-height: 100vh;
      min-width: 1024;
      background-image: url(${backgroundImageUrl});
    `}
  >
    <div
      className={css`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 120px;
        background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
      `}
    >
      <Header />
      <Component {...props} />
    </div>
    <Footer />
  </div>
);

const SideImagePage = ({ Component, sideImage, ...props }) => (
  <div
    css={`
      position: relative;
      height: 100vh;
      overflow-y: hidden;
      min-width: 1024;
      background-image: url(${scienceBgPath});
    `}
  >
    <div
      css={`
        width: 100%;
        height: 5px;
        background-image: linear-gradient(to right, #90278e, #cc3399 35%, #be1e2d 66%, #f6921e);
      `}
    />
    <Link to="/">
      <img
        src={logoPath}
        alt="Kids First Logo"
        className={css`
          width: 230px;
          position: absolute;
          margin: 20px;
        `}
      />
    </Link>
    <div
      className={css`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
      `}
    >
      <div
        css={`
          background: #fff;
          background-image: url(${sideImage});
          background-repeat: no-repeat;
          background-position: bottom;
          width: 573px;
          height: 100%;
          box-shadow: 0 0 6px 0.1px #bbbbbb;
        `}
      />
      <Component {...props} />
    </div>
  </div>
);

const forceSelectRole = ({ loggedInUser, ...props }) => {
  if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/join" />;
  }
  return <Page {...props} />;
};

const render = ({ editing, setEditing, state, effects }) => {
  const { loggedInUser, toast } = state;
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route
              // TODO: we need a user role specific for this
              path="/admin"
              render={({ match }) => <ArrangerDashboard basename={match.url} />}
            />
            <Route path="/auth-redirect" exact component={AuthRedirect} />
            <Route path="/redirected" exact component={() => null} />
            <Route
              path="/search/:index"
              exact
              render={props =>
                forceSelectRole({
                  Component: FileRepo,
                  loggedInUser,
                  index: props.match.params.index,
                  graphqlField: props.match.params.index,
                  ...props,
                })
              }
            />
            <Route
              path="/user/:egoId"
              exact
              render={props =>
                forceSelectRole({
                  Component: UserProfile,
                  backgroundImageUrl: scienceBgPath,
                  loggedInUser,
                  ...props,
                })
              }
            />
            <Route
              path="/join"
              exact
              render={props => <SideImagePage Component={Join} sideImage={joinImage} {...props} />}
            />
            <Route
              path="/"
              exact
              render={props => (
                <SideImagePage Component={LoginPage} sideImage={loginImage} {...props} />
              )}
            />
          </Switch>
          <Modal />
          <Toast {...toast}>{toast.component}</Toast>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default enhance(render);
