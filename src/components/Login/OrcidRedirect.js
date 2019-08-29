import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'querystring';
import { get } from 'lodash';
import autobind from 'auto-bind-es5';

import { getOrcidToken } from 'services/ego/auth';
import { ORCID } from 'common/constants';

import PromptMessage from 'uikit/PromptMessage';
import LoadingSpinner from 'uikit/LoadingSpinner';
import { Link } from 'uikit/Core';

import './index.css';

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


  renderEmailEmpty() {
    return (
      <React.Fragment>
        <p key='error_line_1'>
          We were unable to log you into Kids First DRC via ORCID because you have not shared your email with trusted parties.
        </p>
        <p key='error_line_2'>
          To update your settings, visit your <a href="https://orcid.org/account" target="_blank" rel="noopener noreferrer">ORCID profile</a> under Account Settings -> Edit "Email and notification preferences" and then choose to share your email address either with "Trusted Parties" or "Everyone". The Kids First DRC is a ORCID trusted partner.
        </p>
        <p key='error_line_3'>
          If you have questions or need further assistance, please email support@kidsfirstdrc.org.
        </p>
      </React.Fragment>
    );
  }

  renderEmailNotVerified() {
    return (
      <React.Fragment>
        <p key='error_line_1'>
          We were unable to log you into Kids First DRC via ORCID because you have not valitated your email with ORCID.
        </p>
        <p key='error_line_2'>
          To validate your email, please follow the intructions at <a href="https://support.orcid.org/hc/en-us/articles/360006894294-How-to-verify-your-email-address" target="_blank" rel="noopener noreferrer">https://support.orcid.org/hc/en-us/articles/360006894294-How-to-verify-your-email-address</a>.
        </p>
        <p key='error_line_3'>
          If you have questions or need further assistance, please email support@kidsfirstdrc.org.
        </p>
      </React.Fragment>);

  }

  renderDefaultError() {
    return (
      <React.Fragment>
        <p key='error_line_1'>
          If the error persist, please email support@kidsfirstdrc.org.
        </p>
      </React.Fragment>);

  }

  renderErorrMessages(error) {
    switch (error) {
      case 'email.empty':
        return this.renderEmailEmpty();
      case 'email.not.verified':
        return this.renderEmailNotVerified();
      default:
        return this.renderDefaultError();
    }
  }

  renderError(error) {
    let message = this.renderErorrMessages(error);
    let content = (
      <React.Fragment>
        {message}
        <Link to="/">Try again</Link>
      </React.Fragment>
    )
    return (
      <PromptMessage
        className="generic-error-display"
        heading="An error occured while trying to log in via ORCID"
        content={content}
        error={true}
      />
    );
  }
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
            error: this.renderError(error),
          });
        } else {
          this.handleOrcidError()
        }
      });
  }

  handleOrcidError() {
    this.setState({ error: this.renderError('default') });
  }

  render() {
    const { error } = this.state;
    const content = error ? error : (
      <React.Fragment>
        <LoadingSpinner size={96} color={'#a9adc0'} className="login-redirect-loader" />
        <span>Trying to log in via ORCID iD...</span>
      </React.Fragment>
    );

    return <div className="login-redirect-loader-container">{content}</div>;
  }
}
