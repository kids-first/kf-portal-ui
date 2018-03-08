import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser, provideModalState, provideToast } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import Modal from './components/Modal/index.js';

import Toast from 'uikit/Toast';
import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'theme/defaultTheme';

import scienceBgPath from 'theme/images/background-science.jpg';

const enhance = compose(provideLoggedInUser, provideModalState, provideToast, injectState);

const Page = ({ Component, backgroundImageUrl, containerStyle, ...props }) => (
  <div
    css={`
      position: relative;
      min-height: 100vh;
      overflow-y: hidden;
      min-width: 1024;
      background-image: url(${backgroundImageUrl});
      ${containerStyle};
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
              path="/dashboard"
              exact
              render={props =>
                forceSelectRole({
                  Component: UserDashboard,
                  containerStyle: css`
                    height: 100vh;
                  `,
                  loggedInUser,
                  ...props,
                })
              }
            />
            <Route
              path="/join"
              exact
              render={props => (
                <Page Component={Join} backgroundImageUrl={scienceBgPath} {...props} />
              )}
            />
            <Route
              path="/"
              exact
              render={props => (
                <Page Component={LoginPage} backgroundImageUrl={scienceBgPath} {...props} />
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
