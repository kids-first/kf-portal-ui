import * as React from 'react';
import { compose } from 'recompose';

import { logoutAll } from 'services/login';
import { injectState } from 'freactal';
import { deleteProfile } from 'services/profiles';

const wait = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const enhance = compose(injectState);

const UserProfile = ({ state, effects, setEditing }) => {
  return (
    <div>
      <pre>
        Welcome {state.loggedInUser.firstName} {state.loggedInUser.lastName}
      </pre>
      <pre>{JSON.stringify(state.loggedInUser, null, '  ')}</pre>
      <button
        onClick={() => Promise.race([logoutAll(), wait(2)]).then(() => effects.setUser(null))}
      >
        LOGOUT
      </button>
      <button onClick={() => setEditing(true)}>EDIT</button>
      <button
        onClick={async () => {
          await deleteProfile({ user: state.loggedInUser });
          await logoutAll();
          await effects.setUser(null);
          await effects.setToken('');
        }}
      >
        DELETE ACCOUNT
      </button>
    </div>
  );
};

export default enhance(UserProfile);
