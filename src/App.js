import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser, provideModalState } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { css } from 'react-emotion';
import { ThemeProvider } from 'emotion-theming';
import { Dashboard as ArrangerDashboard } from '@arranger/components';
import Modal from 'react-modal';

import UserProfile from 'components/UserProfile/index';
import FileRepo from 'components/FileRepo';
import Join from 'components/Join';
import AuthRedirect from 'components/AuthRedirect';
import JoinHeader from 'components/JoinHeader';
import Header from 'components/Header';
import Footer from 'components/Footer';
import theme from 'theme/defaultTheme';

import scienceBgPath from 'theme/images/background-science.jpg';

const enhance = compose(provideLoggedInUser, provideModalState, injectState);

const LandingContent = () => (
  <div>
    <h1 style={{ display: 'flex', justifyContent: 'center' }}>Kids First Data Portal</h1>
    Pretty picture here 👶🌳🎈
  </div>
);

const Page = ({ Component, ...props }) => (
  <div
    css={`
      position: relative;
      min-height: 100vh;
      min-width: 1024;
    `}
  >
    <div
      className={css`
        background-image: url(${scienceBgPath});
        background-repeat: repeat;
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

const render = ({ editing, setEditing, state, effects }) => {
  const { loggedInUser, modalState } = state;
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
            <Route
              path="/join"
              exact
              render={props => (
                <div
                  className={css`
                    background-image: url(${scienceBgPath});
                    background-repeat: repeat;
                    height: 100%;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                  `}
                >
                  <JoinHeader />
                  <Join />
                </div>
              )}
            />
            <Route
              exact
              path="/"
              render={props =>
                forceSelectRole({ Component: LandingContent, loggedInUser, ...props })
              }
            />
          </Switch>
          <Modal
            isOpen={modalState.isShown}
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
            appElement={document.getElementById('root')}
          >
            {modalState.component}
          </Modal>
        </div>
      </ThemeProvider>
    </Router>
  );
};

export default enhance(render);
