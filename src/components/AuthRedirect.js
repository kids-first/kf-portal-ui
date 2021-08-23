import React from 'react';
import { withRouter } from 'react-router-dom';
import queryString from 'querystring';
import { compose } from 'recompose';
import urlJoin from 'url-join';

import Login from 'components/Login/Login';

import useUser from '../hooks/useUser';

const AuthRedirect = (props) => {
  const {
    location: { search },
  } = props;
  const { userToken } = useUser();
  if (userToken) {
    const qs = queryString.parse(search.replace(/^\?/, ''));
    // eslint-disable-next-line no-undef
    global.location = urlJoin(qs.redirect_uri, `?token=${userToken}`);
    return null;
  } else {
    return <Login shouldNotRedirect={true} />;
  }
};

export default compose(withRouter)(AuthRedirect);
