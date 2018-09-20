import React, { Component } from 'react';

import googleSDK from 'services/googleSDK';

import { Box } from 'uikit/Core';

const COOKIES_NOT_ENABLED = 'Cookies are not enabled in current environment.';

class GoogleButton extends Component {
  async componentDidMount() {
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
          this.props.login(id_token);
        },
        onfailure: error => {
          global.log('login fail', error);
        },
      });
    } catch (e) {
      const errorDetail = e.details;
      const onError = this.props.onError;

      if (errorDetail === COOKIES_NOT_ENABLED) {
        onError('thirdPartyDataError');
      } else {
        onError('unknowError');
      }

      global.log(e);
    }
  }

  render() {
    return <Box mb={3} key="google" id="googleSignin" />;
  }
}

export default GoogleButton;

/*const GoogleSignIn = styled(Box)`
  #googleSignin > div {
    background-color: #efefef;
    color: #cfcece;
    opacity: 0.75;

    &:hover {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
      cursor: not-allowed;
    }
  }
`;*/
