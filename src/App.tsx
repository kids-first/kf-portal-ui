import * as React from 'react';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import './App.css';
import { provideLoggedInUser } from 'stateProviders';

import Login from 'components/Login';
import { logoutAll } from 'services/login';

const enhance = compose(
  provideLoggedInUser,
  injectState
);

const wait = seconds => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const render = ({ state, effects }) => {
  return <div className="App">
    {!state.loggedInUser && <Login />}
    {state.loggedInUser && (
      <div>
        <pre>Welcome {state.loggedInUser.first_name} {state.loggedInUser.last_name}</pre>
        <pre>{JSON.stringify(state.loggedInUser, null, '  ')}</pre>
        <button
          onClick={() => Promise.race([
            logoutAll(),
            wait(2)
          ]).then(() => effects.setUser(null))}
        >LOGOUT</button>
      </div>
    )}
  </div>
}

export default enhance(render);
