import React from 'react';
import { withRouter } from 'react-router-dom';
import keycloak from 'keycloak';
import queryString from 'querystring';
import { compose } from 'recompose';
import urlJoin from 'url-join';

import Login from 'components/Login/Login';

const AuthRedirect = (props) => {
  const {
    location: { search },
  } = props;

  if (keycloak?.token) {
    const qs = queryString.parse(search.replace(/^\?/, ''));
    // eslint-disable-next-line no-undef
    global.location = urlJoin(qs.redirect_uri, `?token=${keycloak.token}`);
    return null;
  } else {
    return <Login />;
  }
};

export default compose(withRouter)(AuthRedirect);
