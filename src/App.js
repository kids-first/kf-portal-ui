import React, { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ErrorBoundary from 'ErrorBoundary';

import scienceBgPath from 'assets/background-science.jpg';
import logo from 'assets/logo-kids-first-data-portal.svg';
import joinImage from 'assets/smiling-boy.jpg';
import loginImage from 'assets/smiling-girl.jpg';
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
import Page, { FixedFooterPage } from 'components/Page';
import SideImagePage from 'components/SideImagePage';
import UserDashboard from 'components/UserDashboard';
import UserProfile from 'components/UserProfile';
import { default as ApolloProvider } from 'store/providers';
import { Spinner } from 'uikit/Spinner';

import LoginPage from './components/Login/LoginPage';
import { FenceName } from './store/fenceTypes';
import Authenticator from './Authenticator';
import ForumBanner, { showForumBanner } from './ForumBanner';
import ProtectedRoute from './ProtectedRoute';

import 'index.css';

const StudiesPage = lazy(() => import('pages/studies'));
const VariantSearchPage = lazy(() => import('pages/variantsSearchPage'));
const VariantEntityPage = lazy(() => import('pages/variantEntity'));

const App = () => (
  <div className="appContainer">
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
                  Footer={LoginFooter}
                />
              )}
            />
            <Route
              path={ROUTES.login}
              exact
              render={() => (
                <SideImagePage
                  logo={logo}
                  sideImagePath={loginImage}
                  Component={LoginPage}
                  Footer={LoginFooter}
                />
              )}
            />
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
              render={(props) => <Page Component={FileEntity} fileId={props.match.params.fileId} />}
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
  </div>
);

const enhanceApp = () => (
  <ErrorBoundary>
    <ContextProvider>
      <App />
    </ContextProvider>
  </ErrorBoundary>
);

export default enhanceApp;
