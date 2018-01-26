import React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import SelectRoleForm from 'components/forms/SelectRoleForm';
import UserProfile from 'components/UserProfile';
import FileRepo from 'components/FileRepo';
import AuthRedirect from 'components/AuthRedirect';
import Header from 'components/Header';

const enhance = compose(injectState);

const LandingContent = () => (
  <div>
    <h1 style={{ display: 'flex', justifyContent: 'center' }}>Kids First Data Portal</h1>
    Pretty picture here 👶🌳🎈
  </div>
);

const forceSelectRole = (Component, loggedInUser) => {
  if (loggedInUser && (!loggedInUser.roles || !loggedInUser.roles[0])) {
    return <Redirect to="/select-role" />;
  }
  return (
    <div>
      <Header />
      <Component />
    </div>
  );
};

const render = ({ editing, setEditing, state, effects }) => {
  const { loggedInUser } = state;
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/auth-redirect" exact={true} component={AuthRedirect} />
          <Route path="/redirected" exact={true} component={() => null} />
          <Route
            path="/files"
            exact={true}
            render={() => forceSelectRole(FileRepo, loggedInUser)}
          />
          <Route
            path="/user/:egoId"
            exact={true}
            render={() => forceSelectRole(UserProfile, loggedInUser)}
          />
          <Route
            path="/select-role"
            exact={true}
            render={() => {
              if (loggedInUser) {
                return <SelectRoleForm />;
              }
              return <Redirect to="/" />;
            }}
          />
          <Route exact path="/" render={() => forceSelectRole(LandingContent, loggedInUser)} />
        </Switch>
      </div>
    </Router>
  );
};

export default provideLoggedInUser(enhance(render));
