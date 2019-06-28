import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'querystring';
import { get } from 'lodash';
import autobind from 'auto-bind-es5';

import { getOrcidToken } from 'services/ego/auth';
import { ORCID } from 'common/constants';

import GenericErrorDisplay from 'uikit/GenericErrorDisplay';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { Link } from 'uikit/Core';

import './index.css';

const ORCID_ERRORS = {
  'email.empty': {
    message:
      "You should change the visibility setting of your email address so that it's available publicly.",
    link:
      'https://support.orcid.org/hc/en-us/articles/360006894294-How-to-verify-your-email-address',
  },
  'email.not.verified': {
    message: 'You must make sure that your email address has been verified by the ORCID Web site.',
    link: 'https://support.orcid.org/hc/en-us/articles/360006897614-Visibility-settings',
  },
  default: {
    message: ' ',
    link: '/',
  },
};

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
        if (typeof error === 'string') {
          this.setState({
            error: ORCID_ERRORS[error] ? ORCID_ERRORS[error] : ORCID_ERRORS.default,
          });
        } else {
          this.setState({
            error: ORCID_ERRORS.default,
          });
        }
      });
  }

  handleOrcidError() {
    this.setState({ error: ORCID_ERRORS.default });
  }

  renderLink() {
    const { error } = this.state;
    const link = error.link || '/';
    return /^https?:\/\//i.test(link) ? (
      <a href={link} target="_blank">
        See the documentation on the ORCID Web site
      </a>
    ) : (
      <Link to={link}>Try again</Link>
    );
  }

  render() {
    const { error } = this.state;
    const content = error ? (
      <GenericErrorDisplay
        header={'An error occured while trying to log in via ORCID iD'}
        error={error.message}
        footer={this.renderLink()}
      />
    ) : (
      <React.Fragment>
        <LoadingSpinner size={96} color={'#a9adc0'} className="login-redirect-loader" />
        <span>Trying to log in via ORCID iD...</span>
      </React.Fragment>
    );

    return <div className="login-redirect-loader-container">{content}</div>;
  }
}
