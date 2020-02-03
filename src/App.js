import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { Route, Switch, Redirect } from 'react-router-dom';
import Toast from 'uikit/Toast';
import Modal from 'components/Modal';
import GlobalModal from 'components/Modal/GlobalModal';
import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Login/Join';
import { isSelfInUrlWhenLoggedIn } from 'utils';
import LoginPage from 'components/Login/LoginPage';
import LoginFooter from 'components/Login/LoginFooter';
import FileEntity from 'components/EntityPage/File';
import ParticipantEntity from 'components/EntityPage/Participant';
import CohortBuilder from 'components/CohortBuilder';
import MemberSearchPage from 'components/MemberSearchPage';
import AuthRedirect from 'components/AuthRedirect';
import SideImagePage from 'components/SideImagePage';
import Page from 'components/Page';
import { FixedFooterPage } from 'components/Page';
import ContextProvider from 'components/ContextProvider';
import Error from 'components/Error';
import FenceAuthRedirect from 'components/Fence/FenceAuthRedirect';
import { DCF, GEN3 } from 'common/constants';
import loginImage from 'assets/smiling-girl.jpg';
import joinImage from 'assets/smiling-boy.jpg';
import scienceBgPath from 'assets/background-science.jpg';
import logo from 'assets/logo-kids-first-data-portal.svg';
import { requireLogin } from './common/injectGlobals';
import { withApi } from 'services/api';
import { initializeApi, ApiContext } from 'services/api';
import ErrorBoundary from 'ErrorBoundary';
import ROUTES from 'common/routes';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';

const userIsRequiredToLogIn = loggedInUser => {
  return (
    (loggedInUser === null ||
      loggedInUser === undefined ||
      (isPlainObject(loggedInUser) && isEmpty(loggedInUser))) &&
    requireLogin
  );
};

const userIsNotLoggedInOrMustCompleteJoinForm = loggedInUser => {
  return (
    !loggedInUser ||
    isEmpty(loggedInUser) ||
    !loggedInUser.roles ||
    !loggedInUser.roles[0] ||
    !loggedInUser.acceptedTerms
  );
};

const userIsLoggedInButMustCompleteJoinForm = loggedInUser => {
  return (
    isPlainObject(loggedInUser) &&
    !isEmpty(loggedInUser) &&
    (!loggedInUser.roles || !loggedInUser.roles[0] || !loggedInUser.acceptedTerms)
  );
};

const forceSelectRole = ({ loggedInUser, isLoadingUser, WrapperPage = Page, ...props }) => {
  if (userIsRequiredToLogIn(loggedInUser)) {
    return isLoadingUser ? null : (
      <SideImagePage
        logo={logo}
        sideImagePath={loginImage}
        Component={LoginPage}
        Footer={LoginFooter}
      />
    );
  } else if (userIsLoggedInButMustCompleteJoinForm(loggedInUser)) {
    return <Redirect to="/join" />;
  } else {
    return <WrapperPage {...props} />;
  }
};

const App = compose(
  injectState,
  withApi,
)(({ state, api }) => {
  const { loggedInUser, toast, isLoadingUser } = state;

  return (
    <div className="appContainer">
      <Switch>
        <Route path={ROUTES.authRedirect} exact component={AuthRedirect} />
        <Route
          path={ROUTES.cohortBuilder}
          exact
          render={props =>
            forceSelectRole({
              isLoadingUser,
              Component: CohortBuilder,
              // TODO REMOVE?
              loggedInUser,
              // TODO REMOVE?
              index: props.match.params.index,
              // TODO REMOVE?
              graphqlField: props.match.params.index,
              ...props,
            })
          }
        />
        <Route
          path={ROUTES.searchMember}
          exact
          render={props => {
            return forceSelectRole({
              isLoadingUser,
              Component: MemberSearchPage,
              loggedInUser,
              isAdmin: state.isAdmin,
              loggedInUserToken: state.loggedInUserToken,
              ...props,
            });
          }}
        />
        <Route
          path={`${ROUTES.file}/:fileId`}
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
          path={`${ROUTES.participant}/:participantId`}
          exact
          render={props =>
            forceSelectRole({
              isLoadingUser,
              loggedInUser,
              Component: ParticipantEntity,
              participantId: props.match.params.participantId,
              ...props,
            })
          }
        />
        <Route
          path={`${ROUTES.search}/:index`}
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
          path={ROUTES.dashboard}
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
          path={ROUTES.join}
          exact
          render={props => {
            if (userIsNotLoggedInOrMustCompleteJoinForm(loggedInUser)) {
              return (
                <ApiContext.Provider
                  value={initializeApi({ onUnauthorized: () => props.history.push('/login') })}
                >
                  <SideImagePage
                    backgroundImage={scienceBgPath}
                    logo={logo}
                    Component={Join}
                    sideImagePath={joinImage}
                    {...props}
                  />
                </ApiContext.Provider>
              );
            }

            return forceSelectRole({
              api,
              isLoadingUser,
              Component: UserDashboard,
              loggedInUser,
              ...props,
            });
          }}
        />
        <Route
          path="/"
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
        <Route path={ROUTES.authRedirect} exact component={AuthRedirect} />
        <Route
          path={ROUTES.orcid}
          exact
          render={props => (
            <SideImagePage
              logo={logo}
              backgroundImage={scienceBgPath}
              Component={LoginPage}
              Footer={LoginFooter}
              sideImagePath={loginImage}
              stealth={true} // hide some of the visuals of the page during redirection
              {...props}
            />
          )}
        />
        <Route path={ROUTES.redirected} exact component={() => null} />
        <Route path={ROUTES.gen3Redirect} exact render={() => <FenceAuthRedirect fence={GEN3} />} />
        <Route path={ROUTES.dcfRedirect} exact render={() => <FenceAuthRedirect fence={DCF} />} />
        <Route
          path={ROUTES.profile}
          exact
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              Component: UserProfile,
              loggedInUser,
              userID: null,
              ...props,
            })
          }
        />
        <Route
          path={`${ROUTES.user}/:userID`}
          exact
          render={props => {
            const userIdUrlParam = props.match.params.userID;
            return forceSelectRole({
              api,
              isLoadingUser,
              Component: UserProfile,
              loggedInUser,
              userInfo: {
                userID: userIdUrlParam,
                isSelf: isSelfInUrlWhenLoggedIn(userIdUrlParam, loggedInUser),
              },
              ...props,
            });
          }}
        />
        <Route path={ROUTES.error} exact render={() => <Error />} />
        <Redirect from="*" to={ROUTES.dashboard} />
      </Switch>
      <Modal />
      <GlobalModal />
      <Toast {...toast}>{toast.component}</Toast>
    </div>
  );
});

const enhanceApp = () => (
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

export default enhanceApp;
