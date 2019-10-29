import React, { Component } from 'react';

import googleSDK from 'services/googleSDK';

import { Box } from 'uikit/Core';
import DisabledGoogleLogin from './DisabledGoogleLogin';

const COOKIES_NOT_ENABLED = 'Cookies are not enabled in current environment.';

class GoogleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  async componentDidMount() {
    const { onLogin, onError } = this.props;
    try {
      await googleSDK();
      global.gapi.signin2.render('googleSignin', {
        scope: 'profile email',
        width: 240,
        height: 40,
        longtitle: true,
        theme: 'light',
        onsuccess: googleUser => {
          const { id_token } = googleUser.getAuthResponse();
          onLogin(id_token);
        },
        onfailure: error => {
          global.log('login fail', error);
        },
      });
    } catch (e) {
      const errorDetail = e.details;

      this.setState({ disabled: true });

      errorDetail === COOKIES_NOT_ENABLED
        ? onError('thirdPartyDataError')
        : onError('unknownError');

      global.log(e);
    }
  }

  render() {
    return this.state.disabled ? (
      <DisabledGoogleLogin />
    ) : (
      <Box mb={3} key="google" id="googleSignin" className="google-login-button login-button" />
    );
  }
}

export default GoogleButton;
