import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { Route, Switch, Redirect } from 'react-router-dom';
// import { Spin, Icon } from 'antd';

// import { Dashboard as ArrangerDashboardLegacy } from '@kfarranger/components/dist';
// import ArrangerAdmin from 'components/ArrangerAdmin';
// import { isAdminToken, validateJWT } from 'utils';

import Toast from 'uikit/Toast';
import Modal from 'components/Modal';
import GlobalModal from 'components/Modal/GlobalModal';
// import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Login/Join';
// import { isSelfInUrlWhenLoggedIn } from 'utils';
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
// import FenceAuthRedirect from 'components/Fence/FenceAuthRedirect';

import loginImage from 'assets/smiling-girl.jpg';
import joinImage from 'assets/smiling-boy.jpg';
import scienceBgPath from 'assets/background-science.jpg';
import logo from 'assets/logo-kids-first-data-portal.svg';
import { requireLogin } from './common/injectGlobals';
import { withApi } from 'services/api';
import { initializeApi, ApiContext } from 'services/api';
// import { DCF, GEN3 } from 'common/constants';
import ErrorBoundary from 'ErrorBoundary';
import ROUTES from 'common/routes';

const forceSelectRole = ({ loggedInUser, isLoadingUser, WrapperPage = Page, ...props }) => {
  if (!loggedInUser && requireLogin) {
    return isLoadingUser ? null : (
      <SideImagePage
        logo={logo}
        sideImagePath={loginImage}
        Component={LoginPage}
        Footer={LoginFooter}
      />
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

// const ShowLoader = (
//   <Page Component={Spin} indicator={<Icon type="loading" style={{ fontSize: 48 }} spin />} />
// );

// const showDashboardIfLoggedIn = props => {
//   return forceSelectRole({
//     api,
//     isLoadingUser,
//     Component: UserDashboard,
//     loggedInUser,
//     ...props,
//   });
// };

const App = compose(
  injectState,
  withApi,
)(({ state, api }) => {
  const { loggedInUser, toast, isLoadingUser } = state;

  return (
    <div className="appContainer">
      <Switch>
        {/*
        <Route
          path={ROUTES.admin}
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              WrapperPage: FixedFooterPage,
              Component: ({ match, ...props }) => {
                return !isAdminToken({
                  validatedPayload: validateJWT({ jwt: state.loggedInUserToken }),
                }) ? (
                  <Redirect to={ROUTES.dashboard} />
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
          path={ROUTES.adminLegacy}
          render={props =>
            forceSelectRole({
              api,
              isLoadingUser,
              WrapperPage: FixedFooterPage,
              Component: ({ match, ...props }) => {
                return !isAdminToken({
                  validatedPayload: validateJWT({ jwt: state.loggedInUserToken }),
                }) ? (
                  <Redirect to={ROUTES.dashboard} />
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
        */}

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
          render={props =>
            forceSelectRole({
              isLoadingUser,
              Component: MemberSearchPage,
              loggedInUser,
              ...props,
            })
          }
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

        {/* Root route */}
        <Route
          path="/"
          exact
          render={props => (
            <SideImagePage
              logo={logo}
              backgroundImage={scienceBgPath}
              Component={LoginPage}
              Footer={LoginFooter}
              sideImage={loginImage}
              {...props}
            />
          )}
        />

        {/* Authentication related routes */}
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

        {/*
        <Route path={ROUTES.gen3Redirect} exact render={() => <FenceAuthRedirect fence={GEN3} />} />
        <Route path={ROUTES.dcfRedirect} exact render={() => <FenceAuthRedirect fence={DCF} />} />
        */}

        {/* User Profile */}
        {/*
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
        */}

        {/* Error page */}
        <Route path={ROUTES.error} exact render={() => <Error />} />

        {/* Fallback to the Dashboard if route is invalid */}
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
