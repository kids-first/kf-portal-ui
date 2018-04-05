import React from 'react';
import _ from 'lodash';

import facebookSDK from 'services/facebookSDK';

export default class extends React.Component<any, any> {
  async componentDidMount() {
    if (!global.FB) {
      await facebookSDK();
    }
    global.FB.getLoginStatus(response => {
      if (response.authResponse) {
        this.props.onLogin(response);
      } else {
        global.FB.XFBML.parse();
        global.FB.Event.subscribe('auth.login', this.props.onLogin);
      }
    });
  }
  componentWillUnmount() {
    global.FB.Event.unsubscribe('auth.login', this.props.onLogin);
  }
  render() {
    return (
      <div
        {..._.omit(this.props, 'onLogin')}
        className="fb-login-button"
        style={{ height: '40px' }}
        data-max-rows="1"
        data-size="large"
        data-button-type="login_with"
        data-show-faces="false"
        data-auto-logout-link="false"
        data-use-continue-as="false"
        data-scope="public_profile,email"
      />
    );
  }
}
