import React from 'react';
import { hot } from 'react-hot-loader';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'react-emotion';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import { translate } from 'react-i18next';
import Toast from 'uikit/Toast';
import { withTheme } from 'emotion-theming';

import Modal from 'components/Modal';
import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import AuthRedirect from 'components/AuthRedirect';
import SideImagePage from 'components/SideImagePage';
import Page from 'components/Page';
import { FixedFooterPage } from 'components/Page';
import ContextProvider from 'components/ContextProvider';
import Error from 'components/Error';
import { isAdminToken, validateJWT } from 'components/Login';

import scienceBgPath from 'assets/background-science.jpg';
import loginImage from 'assets/smiling-girl.jpg';
import joinImage from 'assets/smiling-boy.jpg';
import logo from 'assets/logo-kids-first-data-portal-beta.svg';
import { requireLogin } from './common/injectGlobals';
import { withApi } from 'services/api';
import { initializeApi, ApiContext } from 'services/api';
import { Gen3AuthRedirect } from 'services/gen3';

const forceSelectRole = ({ loggedInUser, isLoadingUser, WrapperPage = Page, ...props }) => {
  if (!loggedInUser && requireLogin) {
    return isLoadingUser ? null : (
      <SideImagePage logo={logo} sideImage={loginImage} {...{ ...props }} Component={LoginPage} />
    );
  } else if (
    loggedInUser &&
    (!loggedInUser.roles || !loggedInUser.roles[0] || !loggedInUser.acceptedTerms)
  ) {
    return <Redirect to="/join" />;
  } else {
    return <WrapperPage {...props} />;
  }
};

const AppContainer = styled('div')`
  height: 100vh;
  overflow: auto;
  & * {
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.fonts.default}, sans-serif;
  }
  & button {
    border: solid 1px ${({ theme }) => theme.borderGrey};
  }
`;

const App = compose(injectState, withApi, withTheme)(
  ({ editing, setEditing, state, api, theme }) => {
    const { loggedInUser, toast, isLoadingUser } = state;
    return (
      <AppContainer>
        <Switch>
          <Route
            // TODO: we need a user role specific for this
            path="/admin"
            render={props =>
              forceSelectRole({
                api,
                isLoadingUser,
                Component: ({ match, ...props }) => {
                  return !isAdminToken({
                    validatedPayload: validateJWT({ jwt: state.loggedInUserToken }),
                  }) ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <ArrangerDashboard basename={match.url} {...props} />
                  );
                },
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
                isLoadingUser,
                Component: FileRepo,
                WrapperPage: FixedFooterPage,
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
                <ApiContext.Provider
                  value={initializeApi({ onUnauthorized: () => props.history.push('/login') })}
                >
                  <SideImagePage
                    backgroundImage={scienceBgPath}
                    logo={logo}
                    Component={Join}
                    sideImage={joinImage}
                    {...props}
                  />
                </ApiContext.Provider>
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
                {...props}
              />
            )}
          />
          <Route path="/gen3_redirect" exact render={Gen3AuthRedirect} />
          <Route path="/error" exact render={props => <Error {...props} />} />
          <Redirect from="*" to="/dashboard" />
        </Switch>
        <Modal />
        <Toast {...toast}>{toast.component}</Toast>
      </AppContainer>
    );
  },
);

const TranslatedApp = translate('translations', { withRef: true })(() => (
  <ContextProvider>
    <App />
  </ContextProvider>
));

export default hot(module)(TranslatedApp);
