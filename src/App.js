import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { Link, Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import Modal from './components/Modal/index.js';

import Toast from 'uikit/Toast';
import UserProfile from 'components/UserProfile';
import UserDashboard from 'components/UserDashboard';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ContextProvider from 'components/ContextProvider';

import scienceBgPath from 'theme/images/background-science.jpg';
import loginImage from 'assets/smiling-girl.jpg';
import joinImage from 'assets/smiling-boy.jpg';
import logoPath from 'theme/images/logo-kids-first-data-portal.svg';
import { requireLogin } from './common/injectGlobals';

const Page = ({ Component, backgroundImageUrl, containerStyle, ...props }) => (
  <div
    css={`
      position: relative;
      height: 100vh;
      min-width: 1024px;
      background-image: url(${backgroundImageUrl});
      ${containerStyle};
    `}
  >
    <div
      className={css`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
      `}
    >
      <Header />
      <Component {...props} />
      <Footer />
    </div>
  </div>
);

const SideImagePage = ({ Component, sideImage, ...props }) => (
  <div
    css={`
      position: relative;
      height: 100vh;
      overflow-y: hidden;
      min-width: 1024;
      background-image: url(${scienceBgPath});
    `}
  >
    <div
      css={`
        width: 100%;
        height: 5px;
        background-image: linear-gradient(to right, #90278e, #cc3399 35%, #be1e2d 66%, #f6921e);
      `}
    />
    <Link to="/">
      <img
        src={logoPath}
        alt="Kids First Logo"
        className={css`
          width: 230px;
          position: absolute;
          margin: 20px;
        `}
      />
    </Link>
    <div
      className={css`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: row;
        background-image: linear-gradient(to bottom, #fff 400px, transparent 100%);
      `}
    >
      <div
        css={`
          background: #fff;
          background-image: url(${sideImage});
          background-repeat: no-repeat;
          background-position: bottom;
          width: 573px;
          height: 100%;
          box-shadow: 0 0 6px 0.1px #bbbbbb;
        `}
      />

      <Component {...props} />
    </div>
  </div>
);

const forceSelectRole = ({ loggedInUser, ...props }) => {
  if (!loggedInUser && requireLogin) {
    return <SideImagePage sideImage={loginImage} {...props} Component={LoginPage} />;
  } else if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/join" />;
  } else {
    return <Page {...props} />;
  }
};

const App = compose(injectState)(({ editing, setEditing, state, effects }) => {
  const { loggedInUser, toast } = state;
  return (
    <div className="App">
      <Switch>
        <Route
          // TODO: we need a user role specific for this
          path="/admin"
          render={({ match }) => (
            <ArrangerDashboard
              socketConnectionString={window.location.origin}
              socketOptions={{
                path: '/api/socket.io',
              }}
              basename={match.url}
            />
          )}
        />
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
          render={props => <SideImagePage Component={Join} sideImage={joinImage} {...props} />}
        />
        <Route
          path="/"
          exact
          render={props => (
            <SideImagePage Component={LoginPage} sideImage={loginImage} {...props} />
          )}
        />
      </Switch>
      <Modal />
      <Toast {...toast}>{toast.component}</Toast>
    </div>
  );
});

export default () => (
  <ContextProvider>
    <App />
  </ContextProvider>
);
