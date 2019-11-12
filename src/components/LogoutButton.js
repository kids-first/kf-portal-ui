// import * as React from 'react';
import { logoutAll } from 'services/login';
// import { withRouter } from 'react-router-dom';
// import { injectState } from 'freactal';
// import { compose } from 'recompose';
// import { withApi } from 'services/api';

// import { logoutButton } from './Logout.module.css';

// const enhance = compose(
//   withRouter,
//   injectState,
//   withApi,
// );

export const uiLogout = ({ history, setUser, setToken, clearIntegrationTokens, api }) => {
  return logoutAll()
    .then(() => {
      setUser({ api });
      setToken();
      clearIntegrationTokens();
      // we must wait so the freactal state propagates at least once or we will log back in Orcid
      return new Promise(r => setTimeout(r, 100));
    })
    .then(() => {
      history.push('/');
    });
};

// const LogoutButton = ({
//   history,
//   effects: { setToken, setUser, clearIntegrationTokens },
//   className,
//   api,
// }) => (
//   <button
//     className={`${logoutButton} ${className}`}
//     onClick={() => uiLogout({ history, setToken, setUser, clearIntegrationTokens, api })}
//   >
//     Logout
//   </button>
// );

// export default enhance(LogoutButton);
