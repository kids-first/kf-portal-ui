import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'querystring';
import { get } from 'lodash';
import autobind from 'auto-bind-es5';

import { getOrcidToken } from 'services/ego/auth';
import { ORCID } from 'common/constants';
import GenericErrorDisplay from 'uikit/GenericErrorDisplay';

/*
// TODO Orcid - List
- Orcid: handle "processing"
- Orcid: handle errors after redirect
- Orcid: handle network errors (timeout, 500s, 400s)
- Ego: handle network errors (timeout, 500s, 400s)
- Allow login on localhost?
- Make OrcidRedirect an ErrorBoundary?
*/

export default class OrcidRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
    autobind(this);
  }

  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }),
    loggedInUserToken: PropTypes.string,
    loginProvider: PropTypes.string,
  };

  componentDidMount() {
    this.code || this.hasOrcidToken() ? this.handleOrcidSuccess() : this.handleOrcidError();
  }

  hasOrcidToken() {
    const { loginProvider, loggedInUserToken } = this.props;
    return loginProvider === ORCID && loggedInUserToken;
  }

  get code() {
    const search = get(this.props, 'location.search', '');
    const qs = queryString.parse(search.replace(/^\?/, ''));
    return get(qs, 'code', '');
  }

  handleOrcidSuccess() {
    // already logged in with Orcid
    if (this.hasOrcidToken()) {
      this.props.onLogin(this.props.loggedInUserToken);
      return;
    }

    getOrcidToken(this.code)
      .then(this.props.onLogin)
      .catch(error => {
        this.setState({ error });
      });
  }

  handleOrcidError() {
    this.setState({ error: 'missing "code" in url' });
  }

  render() {
    const { error } = this.state;

    // TODO Orcid - handle 'email.empty'
    // if (error === 'email.empty') {}

    // TODO Orcid - handle 'email.not.verified'
    // if (error === 'email.not.verified') {}

    if (error) return <GenericErrorDisplay error={error} />;

    // TODO Orcid - Loader
    return 'PROCESSING ORCID LOGIN, please wait';
  }
}
