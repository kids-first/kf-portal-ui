import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import { translate } from 'react-i18next';
import Toast from 'uikit/Toast';

import Modal from 'components/Modal';
import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import AuthRedirect from 'components/AuthRedirect';
import SideImagePage from 'components/SideImagePage';
import Page from 'components/Page';
import ContextProvider from 'components/ContextProvider';

import scienceBgPath from 'theme/images/background-science.jpg';
import loginImage from 'assets/smiling-girl.jpg';
import joinImage from 'assets/smiling-boy.jpg';
import logo from 'theme/images/logo-kids-first-data-portal.svg';
import { requireLogin } from './common/injectGlobals';
import initializeApi from 'services/api';

const forceSelectRole = ({ loggedInUser, isLoadingUser, ...props }) => {
  if (!loggedInUser && requireLogin) {
    return isLoadingUser ? null : (
      <SideImagePage sideImage={loginImage} {...{ ...props }} Component={LoginPage} />
    );
  } else if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/join" />;
  } else {
    return <Page {...{ ...props }} />;
  }
};

const App = compose(injectState)(({ editing, setEditing, state, effects: { setApi } }) => {
  const { loggedInUser, toast, isLoadingUser } = state;

  const api = initializeApi({
    onUnauthorized: response => {
      window.location.reload();
    },
  });
  setApi(api);

  return (
    <div className="App">
      <Switch>
        <Route
          // TODO: we need a user role specific for this
          path="/admin"
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              Component: ({ match, ...props }) => (
                <ArrangerDashboard basename={match.url} {...props} />
              ),
              loggedInUser,
              index: props.match.params.index,
              graphqlField: props.match.params.index,
              ...props,
            })
          }
        />
        <Route path="/auth-redirect" exact component={AuthRedirect} />
        <Route path="/redirected" exact component={() => null} />
        <Route
          path="/search/:index"
          exact
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
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
              api,
              isLoadingUser,
              Component: UserProfile,
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
              api,
              isLoadingUser,
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
          render={props => {
            return (
              <SideImagePage
                backgroundImage={scienceBgPath}
                logo={logo}
                Component={Join}
                sideImage={joinImage}
                {...{ ...props, api }}
              />
            );
          }}
        />
        <Route
          path="/"
          exact
          render={props => (
            <SideImagePage
              logo={logo}
              backgroundImage={scienceBgPath}
              Component={LoginPage}
              sideImage={loginImage}
              {...{ ...props, api }}
            />
          )}
        />
        <Redirect from="*" to="/dashboard" />
      </Switch>
      <Modal />
      <Toast {...toast}>{toast.component}</Toast>
    </div>
  );
});

export default translate('translations')(() => (
  <ContextProvider>
    <App />
  </ContextProvider>
));
