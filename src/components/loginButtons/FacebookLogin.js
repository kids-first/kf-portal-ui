/* eslint-disable no-undef */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { facebookStatus } from 'services/login';

import DisabledFacebookLogin from './DisabledFacebookLogin';

class FacebookLogin extends Component {
  static propTypes = {
    onLogin: PropTypes.func,
    onError: PropTypes.func,
  };

  state = {
    disabled: false,
  };

  onClick = () => {
    facebookStatus()
      .then((response) => {
        if (response.authResponse) {
          this.props.onLogin(response);
        } else {
          global.FB.XFBML.parse();
          global.FB.Event.subscribe('auth.login', this.props.onLogin);
        }
      })
      .catch((err) => {
        console.warn('unable to get fb login status: ', err);
        this.props.onError('facebookError');
        this.setState({ disabled: true });
      });
  };

  componentWillUnmount() {
    try {
      global.FB.Event.unsubscribe('auth.login', this.props.onLogin);
    } catch (err) {
      console.warn('unable to unsubscribe to fb event: ', err);
    }
  }

  render() {
    return this.state.disabled ? (
      <DisabledFacebookLogin />
    ) : (
      <div
        onClick={this.onClick}
        className="fb-login-button login-button"
        style={{ height: '40px' }}
        data-max-rows="1"
        data-size="large"
        data-width="240"
        data-button-type="login_with"
        data-show-faces="false"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        data-scope="public_profile,email"
      />
    );
  }
}

export default FacebookLogin;
