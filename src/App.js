import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser, provideModalState, provideToast } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import Modal from 'react-modal';

import Toast from 'uikit/Toast';
import UserProfile from 'components/UserProfile';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import LoginPage from 'components/LoginPage';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'theme/defaultTheme';

import scienceBgPath from 'theme/images/background-science.jpg';

const enhance = compose(provideLoggedInUser, provideModalState, provideToast, injectState);

const Page = ({ Component, ...props }) => (
  <div
    css={`
      position: relative;
      min-height: 100vh;
      min-width: 1024;
      background-image: url(${scienceBgPath});
    `}
  >
    <div
      className={css`
        background-repeat: repeat;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 120px;
      `}
    >
      <Header />
      <Component {...props} />
    </div>
    <Footer />
  </div>
);

const forceSelectRole = ({ loggedInUser, ...props }) => {
  if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/join" />;
  }
  return <Page {...props} />;
};

const render = ({
  editing,
  setEditing,
  state,
  effects,
  appElement = document.getElementById('root'),
}) => {
  const { loggedInUser, modalState, toast } = state;
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Switch>
            <Route
              // TODO: we need a user role specific for this
              path="/admin"
              render={({ match }) => <ArrangerDashboard basename={match.url} />}
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
                  ...props,
                })
              }
            />
            <Route
              path="/user/:egoId"
              exact
              render={props => forceSelectRole({ Component: UserProfile, loggedInUser, ...props })}
            />
            <Route path="/join" exact render={props => <Page Component={Join} {...props} />} />
            <Route path="/" exact render={props => <Page Component={LoginPage} {...props} />} />
          </Switch>
          <Modal
            isOpen={!!modalState.component}
            style={{
              overlay: {
                position: 'fixed',
                top: '0px',
                left: '0px',
                right: '0px',
                bottom: '0px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'block',
                zIndex: '111',
              },
              content: {
                position: 'initial',
                border: '1px solid rgb(204, 204, 204)',
                background: 'rgb(255, 255, 255)',
                borderRadius: '4px',
                margin: '30px auto',
                width: '55%',
                boxShadow: 'rgba(0, 0, 0, 0.5) 0px 5px 15px',
                overflow: 'visible',
              },
            }}
            appElement={appElement}
          >
            {modalState.component}
          </Modal>
          <Toast {...toast}>{Object.keys(toast).length && toast.component}</Toast>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default enhance(render);
