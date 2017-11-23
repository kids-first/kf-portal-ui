import React from 'react';

import queryString from 'querystring';

import { compose } from 'recompose';
import { injectState } from 'freactal';
import urlJoin from 'url-join';

import Login from 'components/Login';

const enhance = compose(injectState);

const AuthRedirect = props => {
  const { location: { search } } = props;
  const qs = queryString.parse(search.replace(/^\?/, ''));
  if (props.state.loggedInUserToken) {
    global.location = urlJoin(qs.redirect_uri, `?token=${props.state.loggedInUserToken}`);
    return null;
  } else {
    return <Login {...props} shouldNotRedirect={true} />;
  }
};

export default enhance(AuthRedirect);
