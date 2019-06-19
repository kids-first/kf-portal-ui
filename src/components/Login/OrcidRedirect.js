import React from 'react';
import queryString from 'querystring';
import { get } from 'lodash';
import autobind from 'auto-bind-es5';
import { getOrcidToken } from 'services/ego/auth';

import GenericErrorDisplay from 'uikit/GenericErrorDisplay';

/*
// TODO Orcid
- Orcid: handle "processing"
- Orcid: handle errors after redirect
- Orcid: handle network errors (timeout, 500s, 400s)
- Ego: handle success
- Ego: handle "processing"
- Ego: handle errors
- Ego: handle network errors (timeout, 500s, 400s)
- Allow login on localhost?
- Make OrcidRedirect an ErrorBoundary
*/

// NOTES
// See FenceAuthRedirect

// https://kf-qa.netlify.com/orcid?code=FsFksA
export default class OrcidRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      token: null,
    };
    autobind(this);
  }

  componentDidMount() {
    this.code ? this.handleOrcidSuccess() : this.handleOrcidError();
  }

  get code() {
    const search = get(this.props, 'location.search', {});
    const qs = queryString.parse(search.replace(/^\?/, ''));
    return get(qs, 'code', '');
  }

  handleOrcidSuccess() {
    getOrcidToken(this.code)
      .then(token => {
        this.setState({ token });
        // TODO Orcid use the token
        console.log(`🔥 TOKEN ${token}`);
      })
      .catch(error => {
        this.setState({ error });
      });
  }

  handleOrcidError() {
    this.setState({ error: 'missing "code" in url' });
  }

  render() {
    const { token, error } = this.state;

    if (token) {
      return `TOKEN: ${token}`;
    }

    if (error === 'email.empty') {
      return 'GIVE YOUR EMAIL YOU FOO!';
    }

    if (error === 'email.not.verified') {
      return 'VERIFY YOUR EMAIL YOU FOO!';
    }

    if (error) return <GenericErrorDisplay error={error} />;

    return 'PROCESSING ORCID LOGIN, please wait';
  }
}
