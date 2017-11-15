import * as React from 'react';
import { compose, withState } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';

import Login from 'components/Login';
import EditProfileForm from 'components/forms/EditProfileForm';
import SelectRoleForm from 'components/forms/SelectRoleForm';
import UserProfile from 'components/UserProfile';

import { logoutAll } from 'services/login';

const enhance = compose(
  provideLoggedInUser,
  injectState,
  withState('editing', 'setEditing', false),
);

const render = ({ editing, setEditing, state, effects }) => {
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
  return <div className="App">{content}</div>;
};

export default enhance(render);
