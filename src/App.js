import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ErrorBoundary from 'ErrorBoundary';
import { injectState } from 'freactal';
import isEmpty from 'lodash/isEmpty';
import isPlainObject from 'lodash/isPlainObject';
import { compose } from 'recompose';

import scienceBgPath from 'assets/background-science.jpg';
import logo from 'assets/logo-kids-first-data-portal.svg';
import joinImage from 'assets/smiling-boy.jpg';
import loginImage from 'assets/smiling-girl.jpg';
import { DCF, GEN3 } from 'common/constants';
import { requireLogin } from 'common/injectGlobals';
import ROUTES from 'common/routes';
import AuthRedirect from 'components/AuthRedirect';
import CohortBuilder from 'components/CohortBuilder';
import ContextProvider from 'components/ContextProvider';
import FileEntity from 'components/EntityPage/File';
import ParticipantEntity from 'components/EntityPage/Participant';
import Error from 'components/Error';
import FenceAuthRedirect from 'components/Fence/FenceAuthRedirect';
import FileRepo from 'components/FileRepo';
import Join from 'components/Login/Join';
import LoginFooter from 'components/Login/LoginFooter';
import TermsConditions from 'components/Login/TermsConditions';
import MemberSearchPage from 'components/MemberSearchPage';
import Modal from 'components/Modal';
import Page, { FixedFooterPage } from 'components/Page';
import SideImagePage from 'components/SideImagePage';
import UserDashboard from 'components/UserDashboard';
import UserProfile from 'components/UserProfile';
import { withApi } from 'services/api';
import { default as ApolloProvider } from 'store/providers';
import { Spinner } from 'uikit/Spinner';
import { hasUserRole, isSelfInUrlWhenLoggedIn } from 'utils';

import LoginPage from './components/Login/LoginPage';
import ForumBanner, { showForumBanner } from './ForumBanner';

import 'index.css';

const userIsRequiredToLogIn = (loggedInUser) =>
  (loggedInUser === null ||
    loggedInUser === undefined ||
    (isPlainObject(loggedInUser) && isEmpty(loggedInUser))) &&
  requireLogin;

const StudiesPage = lazy(() => import('pages/studies'));
const VariantSearchPage = lazy(() => import('pages/variantsSearchPage'));
const VariantEntityPage = lazy(() => import('pages/variantEntity'));

const App = compose(
  injectState,
  withApi,
)(({ state, api }) => {
  const { loggedInUser, isLoadingUser, isJoining, egoGroups } = state;

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
      // eslint-disable-next-line react/prop-types
    } else if (!loggedInUser.acceptedTerms) {
      return <Redirect to={ROUTES.termsConditions} />;
    }
    return <WrapperPage {...props} />;
  };

  return (
    <ApolloProvider userToken={state.loggedInUserToken}>
      <div className="appContainer">
        {showForumBanner() && <ForumBanner />}
        <Suspense fallback={<Spinner className={'spinner'} size={'large'} />}>
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
              /* temporary: this will be the new variant db page*/
              path={ROUTES.variant}
              exact
              render={(props) =>
                protectRoute({
                  api,
                  isLoadingUser,
                  Component: VariantSearchPage,
                  WrapperPage: FixedFooterPage,
                  loggedInUser,
                  egoGroups,
                  ...props,
                })
              }
            />
            <Route
              path={`${ROUTES.variant}/:hash`}
              exact
              render={(props) =>
                protectRoute({
                  isLoadingUser,
                  Component: VariantEntityPage,
                  loggedInUser,
                  hash: props.match.params.hash,
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
              path={ROUTES.studies}
              exact
              render={(props) =>
                protectRoute({
                  api,
                  isLoadingUser,
                  Component: StudiesPage,
                  WrapperPage: FixedFooterPage,
                  loggedInUser,
                  userToken: state.loggedInUserToken,
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
            <Route path="/" exact render={() => <Redirect to={ROUTES.dashboard} />} />
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
            <Route
              path={ROUTES.gen3Redirect}
              exact
              render={() => <FenceAuthRedirect fence={GEN3} />}
            />
            <Route
              path={ROUTES.dcfRedirect}
              exact
              render={() => <FenceAuthRedirect fence={DCF} />}
            />
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
        </Suspense>
        <Modal />
      </div>
    </ApolloProvider>
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
