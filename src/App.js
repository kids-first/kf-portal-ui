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
import { hasUserRole, isSelfInUrlWhenLoggedIn } from 'utils';
import LoginPage from './components/Login/LoginPage';
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
import { requireLogin } from 'common/injectGlobals';
import { withApi } from 'services/api';
import ErrorBoundary from 'ErrorBoundary';
import ROUTES from 'common/routes';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';
import VariantDb from 'components/VariantDb';
import TermsConditions from 'components/Login/TermsConditions';
import Join from 'components/Login/Join';
import { Spinner } from 'uikit/Spinner';
import 'index.css';

const userIsRequiredToLogIn = (loggedInUser) =>
  (loggedInUser === null ||
    loggedInUser === undefined ||
    (isPlainObject(loggedInUser) && isEmpty(loggedInUser))) &&
  requireLogin;

const App = compose(
  injectState,
  withApi,
)(({ state, api }) => {
  const { loggedInUser, toast, isLoadingUser, isJoining } = state;

  if (isLoadingUser) {
    return <Spinner className={'spinner'} size={'large'} />;
  }

  const isJoinFormNeeded = (loggedInUser) =>
    userIsRequiredToLogIn(loggedInUser) || !hasUserRole(loggedInUser) || isJoining;

  // eslint-disable-next-line react/prop-types
  const protectRoute = ({ loggedInUser, WrapperPage = Page, ...props }) => {
    if (userIsRequiredToLogIn(loggedInUser)) {
      return (
        <SideImagePage
          logo={logo}
          sideImagePath={loginImage}
          Component={LoginPage}
          Footer={LoginFooter}
        />
      );
    } else if (isJoinFormNeeded(loggedInUser)) {
      return <Redirect to="/join" />;
    }
    return <WrapperPage {...props} />;
  };

  return (
    <div className="appContainer">
      <Switch>
        <Route path={ROUTES.authRedirect} exact component={AuthRedirect} />
        <Route
          path={ROUTES.termsConditions}
          exact
          render={() => (
            <SideImagePage
              logo={logo}
              sideImagePath={loginImage}
              Component={TermsConditions}
              Footer={LoginFooter}
            />
          )}
        />
        <Route
          path={ROUTES.cohortBuilder}
          exact
          render={(props) =>
            protectRoute({
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
          render={(props) =>
            protectRoute({
              isLoadingUser,
              Component: MemberSearchPage,
              loggedInUser,
              isAdmin: state.isAdmin,
              loggedInUserToken: state.loggedInUserToken,
              ...props,
            })
          }
        />
        <Route
          path={ROUTES.variantDb}
          exact
          render={(props) =>
            protectRoute({
              api,
              isLoadingUser,
              Component: VariantDb,
              loggedInUser,
              WrapperPage: FixedFooterPage,
              ...props,
            })
          }
        />
        <Route
          path={`${ROUTES.file}/:fileId`}
          exact
          render={(props) =>
            protectRoute({
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
          render={(props) =>
            protectRoute({
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
          render={(props) =>
            protectRoute({
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
          render={(props) =>
            protectRoute({
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
          render={() => {
            if (isJoinFormNeeded(loggedInUser)) {
              return (
                <SideImagePage
                  backgroundImage={scienceBgPath}
                  logo={logo}
                  Component={Join}
                  sideImagePath={joinImage}
                />
              );
            }
            return <Redirect to="/" />;
          }}
        />
        <Route
          path="/"
          exact
          render={(props) =>
            protectRoute({
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
          render={(props) => (
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
          render={(props) =>
            protectRoute({
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
          render={(props) => {
            const userIdUrlParam = props.match.params.userID;
            return protectRoute({
              api,
              isLoadingUser,
              Component: UserProfile,
              loggedInUser,
              userInfo: {
                userID: userIdUrlParam,
                isSelf: isSelfInUrlWhenLoggedIn(userIdUrlParam, loggedInUser),
              },
              isAdmin: state.isAdmin,
              ...props,
            });
          }}
        />
        <Route
          path={ROUTES.error}
          exact
          render={() => (
            <SideImagePage
              logo={logo}
              sideImagePath={loginImage}
              Component={Error}
              Footer={LoginFooter}
            />
          )}
        />
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
