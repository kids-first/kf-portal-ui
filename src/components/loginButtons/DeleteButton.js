import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { deleteProfile } from 'services/profiles';
import { logoutAll } from 'services/login';
import { injectState } from 'freactal';
import { compose } from 'recompose';

export default compose(injectState, withRouter)(
  ({ history, state: { loggedInUser, effects }, className, children, ...props }) => (
    <div>
      {console.log(loggedInUser)}
      {loggedInUser && (
        <button
          className={className}
          onClick={async () => {
            await deleteProfile({ user: loggedInUser });
            await logoutAll();
            await effects.setUser(null);
            await effects.setToken('');
          }}
          {...props}
        >
          {children}
        </button>
      )}
      {!loggedInUser && <Redirect to="/join" />}
    </div>
  ),
);
