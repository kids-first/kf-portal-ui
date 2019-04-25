import React from 'react';
import { hot } from 'react-hot-loader';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { Route, Switch, Redirect } from 'react-router-dom';
import styled from 'react-emotion';
import { translate } from 'react-i18next';
import Toast from 'uikit/Toast';
import { withTheme } from 'emotion-theming';
import { Dashboard as ArrangerDashboardLegacy } from '@arranger/components/dist';

import Modal from 'components/Modal';
import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import FileEntity from './components/EntityPage/File';
import ParticipantEntity from './components/EntityPage/Participant';
import CohortBuilder from './components/CohortBuilder';
import AuthRedirect from 'components/AuthRedirect';
import SideImagePage from 'components/SideImagePage';
import Page from 'components/Page';
import { FixedFooterPage } from 'components/Page';
import ContextProvider from 'components/ContextProvider';
import Error from 'components/Error';
import { isAdminToken, validateJWT } from 'components/Login';
import FenceAuthRedirect from 'components/Fence/FenceAuthRedirect';

import scienceBgPath from 'assets/background-science.jpg';
import loginImage from 'assets/smiling-girl.jpg';
import joinImage from 'assets/smiling-boy.jpg';
import logo from 'assets/logo-kids-first-data-portal.svg';
import { requireLogin } from './common/injectGlobals';
import { withApi } from 'services/api';
import { initializeApi, ApiContext } from 'services/api';
import { DCF, GEN3, COHORT_BUILDER_PATH } from 'common/constants';
import ArrangerAdmin from 'components/ArrangerAdmin';

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
`;

const App = compose(
  injectState,
  withApi,
  withTheme,
)(({ editing, setEditing, state, api, theme }) => {
  const { loggedInUser, toast, isLoadingUser } = state;
  return (
    <AppContainer>
      <Switch>
        <Route
          path="/admin"
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              WrapperPage: FixedFooterPage,
              Component: ({ match, ...props }) => {
                return !isAdminToken({
                  validatedPayload: validateJWT({ jwt: state.loggedInUserToken }),
                }) ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <ArrangerAdmin baseRoute={match.url} failRedirect={'/'} />
                );
              },
              loggedInUser,
              index: props.match.params.index,
              graphqlField: props.match.params.index,
              ...props,
            })
          }
        />
        <Route
          // TODO: left here for convenience during roll out of the new admin
          path="/admin_legacy"
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              WrapperPage: FixedFooterPage,
              Component: ({ match, ...props }) => {
                return !isAdminToken({
                  validatedPayload: validateJWT({ jwt: state.loggedInUserToken }),
                }) ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <ArrangerDashboardLegacy basename={match.url} {...props} />
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
          path={COHORT_BUILDER_PATH}
          exact
          render={props =>
            forceSelectRole({
              isLoadingUser,
              Component: CohortBuilder,
              loggedInUser,
              index: props.match.params.index,
              graphqlField: props.match.params.index,
              ...props,
            })
          }
        />
        <Route
          path="/file/:fileId"
          exact
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              Component: FileEntity,
              loggedInUser,
              fileId: props.match.params.fileId,
              ...props,
            })
          }
        />
        <Route
          path="/participant/:participantId"
          exact
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              Component: ParticipantEntity,
              loggedInUser,
              participantId: props.match.params.participantId,
              ...props,
            })
          }
        />
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
        <Route path="/gen3_redirect" exact render={props => <FenceAuthRedirect fence={GEN3} />} />
        <Route path="/dcf_redirect" exact render={props => <FenceAuthRedirect fence={DCF} />} />
        <Route path="/error" exact render={props => <Error {...props} />} />
        <Redirect from="*" to="/dashboard" />
      </Switch>
      <Modal />
      <Toast {...toast}>{toast.component}</Toast>
    </AppContainer>
  );
});

const TranslatedApp = translate('translations', { withRef: true })(() => (
  <ContextProvider>
    <App />
  </ContextProvider>
));

export default hot(module)(TranslatedApp);
