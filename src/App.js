import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';

import UserProfile from 'components/UserProfile';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';
import theme from 'theme/defaultTheme';

import scienceBgPath from 'theme/images/background-science.jpg';

const enhance = compose(injectState);

const LandingContent = () => (
  <div>
    <h1 style={{ display: 'flex', justifyContent: 'center' }}>Kids First Data Portal</h1>
    Pretty picture here 👶🌳🎈
  </div>
);

const Page = ({ Component, ...props }) => (
  <div
    className={css`
      background-image: url(${scienceBgPath});
      background-repeat: repeat;
      min-height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    `}
  >
    <Header />
    <Component {...props} />
  </div>
);

const forceSelectRole = ({ loggedInUser, ...props }) => {
  if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/join" />;
  }
  return <Page {...props} />;
};

const render = ({ editing, setEditing, state, effects }) => {
  const { loggedInUser } = state;
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
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
                  ...props,
                })
              }
            />
            <Route
              path="/user/:egoId"
              exact
              render={props => forceSelectRole({ Component: UserProfile, loggedInUser, ...props })}
            />
            <Route path="/join" exact render={props => <Page Component={Join} {...props} />} />
            <Route
              exact
              path="/"
              render={props =>
                forceSelectRole({ Component: LandingContent, loggedInUser, ...props })
              }
            />
          </Switch>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default provideLoggedInUser(enhance(render));
