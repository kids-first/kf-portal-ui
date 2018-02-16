import React from 'react';
import { withRouter } from 'react-router-dom';
import { deleteProfile } from 'services/profiles';
import { injectState } from 'freactal';
import { compose } from 'recompose';
import { uiLogout } from 'components/LogoutButton';

export default compose(injectState, withRouter)(
  ({ history, state: { loggedInUser }, effects: { setUser }, className, children, ...props }) => (
    <button
      className={className}
      onClick={async () => {
        await deleteProfile({ user: loggedInUser });
        uiLogout({ history, setUser });
      }}
      {...props}
    >
      {children}
    </button>
  ),
);
