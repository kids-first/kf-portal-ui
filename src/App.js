import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import Authenticator from 'Authenticator';
import ContextProvider from 'ContextProvider';
import ErrorBoundary from 'ErrorBoundary';
import ForumBanner, { showForumBanner } from 'ForumBanner';
import ProtectedRoute from 'ProtectedRoute';

import scienceBgPath from 'assets/background-science.jpg';
import logo from 'assets/logo-kids-first-data-portal.svg';
import joinImage from 'assets/smiling-boy.jpg';
import loginImage from 'assets/smiling-girl.jpg';
import ROUTES from 'common/routes';
import AppFooter from 'components/AppFooter';
import AuthRedirect from 'components/AuthRedirect';
import CohortBuilder from 'components/CohortBuilder';
import FileEntity from 'components/EntityPage/File';
import ParticipantEntity from 'components/EntityPage/Participant';
import Error from 'components/Error';
import FenceAuthRedirect from 'components/Fence/FenceAuthRedirect';
import FileRepo from 'components/FileRepo';
import Join from 'components/Login/Join';
import LoginPage from 'components/Login/LoginPage';
import TermsConditions from 'components/Login/TermsConditions';
import MemberSearchPage from 'components/MemberSearchPage';
import Page, { FixedFooterPage } from 'components/Page';
import SideImagePage from 'components/SideImagePage';
import UserDashboard from 'components/UserDashboard';
import UserProfile from 'components/UserProfile';
import { FenceName } from 'store/fenceTypes';
import { default as ApolloProvider } from 'store/providers';
import { Spinner } from 'uikit/Spinner';

import 'index.css';

const StudiesPage = lazy(() => import('pages/studies'));
const VariantSearchPage = lazy(() => import('pages/variantsSearchPage'));
const VariantEntityPage = lazy(() => import('pages/variantEntity'));

const App = () => {
  const { keycloak, initialized } = useKeycloak();
  const keycloakIsReady = keycloak && initialized;
  return (
    <div className="appContainer">
      {keycloakIsReady ? (
        <Authenticator>
          <ApolloProvider>
            {showForumBanner() && <ForumBanner />}
            <Suspense fallback={<Spinner className={'spinner'} size={'large'} />}>
              <Switch>
                <Route path="/" exact render={() => <Redirect to={ROUTES.dashboard} />} />
                <Route
                  path={ROUTES.gen3Redirect}
                  exact
                  render={() => <FenceAuthRedirect fence={FenceName.gen3} />}
                />
                <Route
                  path={ROUTES.dcfRedirect}
                  exact
                  render={() => <FenceAuthRedirect fence={FenceName.dcf} />}
                />
                <Route path={ROUTES.authRedirect} exact component={AuthRedirect} />
                <Route
                  path={ROUTES.error}
                  exact
                  render={() => (
                    <SideImagePage
                      logo={logo}
                      sideImagePath={loginImage}
                      Component={Error}
                      Footer={AppFooter}
                    />
                  )}
                />
                <Route
                  path={ROUTES.login}
                  exact
                  render={() => <SideImagePage sideImagePath={loginImage} Component={LoginPage} />}
                />
                <Route
                  path={ROUTES.termsConditions}
                  exact
                  render={() => (
                    <SideImagePage
                      logo={logo}
                      sideImagePath={loginImage}
                      Component={TermsConditions}
                      Footer={AppFooter}
                    />
                  )}
                />
                <ProtectedRoute
                  path={ROUTES.cohortBuilder}
                  exact
                  render={() => <Page Component={CohortBuilder} />}
                />
                <ProtectedRoute
                  path={ROUTES.searchMember}
                  exact
                  render={() => <Page Component={MemberSearchPage} />}
                />
                <ProtectedRoute
                  path={ROUTES.variant}
                  exact
                  render={() => <FixedFooterPage Component={VariantSearchPage} />}
                />
                <ProtectedRoute
                  path={`${ROUTES.variant}/:hash`}
                  exact
                  render={() => <Page Component={VariantEntityPage} />}
                />
                <ProtectedRoute
                  path={`${ROUTES.file}/:fileId`}
                  exact
                  render={(props) => (
                    <Page Component={FileEntity} fileId={props.match.params.fileId} />
                  )}
                />
                <ProtectedRoute
                  path={`${ROUTES.participant}/:participantId`}
                  exact
                  render={(props) => (
                    <Page
                      Component={ParticipantEntity}
                      participantId={props.match.params.participantId}
                      location={props.location}
                    />
                  )}
                />
                <ProtectedRoute
                  path={`${ROUTES.search}/:index`}
                  exact
                  render={(props) => (
                    <FixedFooterPage
                      Component={FileRepo}
                      index={props.match.params.index}
                      graphqlField={props.match.params.index}
                    />
                  )}
                />
                <ProtectedRoute
                  path={ROUTES.dashboard}
                  exact
                  render={() => <Page Component={UserDashboard} />}
                />
                <ProtectedRoute path={ROUTES.studies} exact component={StudiesPage} />
                <Route
                  path={ROUTES.join}
                  exact
                  render={() => (
                    <SideImagePage
                      backgroundImage={scienceBgPath}
                      logo={logo}
                      Component={Join}
                      sideImagePath={joinImage}
                    />
                  )}
                />

                <ProtectedRoute
                  path={ROUTES.profile}
                  exact
                  render={(props) => <Page Component={UserProfile} location={props.location} />}
                />
                <ProtectedRoute
                  path={`${ROUTES.user}/:userID`}
                  exact
                  render={(props) => {
                    const userIdUrlParam = props.match.params.userID;
                    return (
                      <Page
                        Component={UserProfile}
                        location={props.location}
                        userIdFromUrl={userIdUrlParam}
                      />
                    );
                  }}
                />
                <Redirect from="*" to={ROUTES.dashboard} />
              </Switch>
            </Suspense>
          </ApolloProvider>
        </Authenticator>
      ) : (
        <Spinner className={'spinner'} size={'large'} />
      )}
    </div>
  );
};

const enhanceApp = () => (
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

export default enhanceApp;
