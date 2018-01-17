import React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from 'components/Login';
import EditProfileForm from 'components/forms/EditProfileForm';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import UserProfile from 'components/UserProfile';
import AuthRedirect from 'components/AuthRedirect';

const enhance = compose(injectState, withState('editing', 'setEditing', false));

const Content = enhance(({ editing, state, setEditing }) => {
  let content: any = null;

  if (editing) {
    content = <EditProfileForm onFinish={() => setEditing(false)} />;
  } else if (state.loggedInUser) {
    if (state.loggedInUser.roles && state.loggedInUser.roles[0]) {
      content = <UserProfile setEditing={setEditing} />;
    } else {
      content = <SelectRoleForm />;
    }
  } else {
    content = <Login />;
  }
  return content;
});

const render = ({ editing, setEditing, state, effects }) => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/auth-redirect" exact={true} component={AuthRedirect} />
          <Route path="/redirected" exact={true} component={() => null} />
          <Route component={Content} />
        </Switch>
      </div>
    </Router>
  );
};

export default provideLoggedInUser(render);
