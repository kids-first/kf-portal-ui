import React from 'react';
import _ from 'lodash';

import facebookSDK from 'services/facebookSDK';

import DisabledFacebookLogin from './DisabledFacebookLogin';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
    };
  }

  async componentDidMount() {
    try {
      await facebookSDK();

      global.FB.getLoginStatus(response => {
        if (response.authResponse) {
          this.props.onLogin(response);
        } else {
          global.FB.XFBML.parse();
          global.FB.Event.subscribe('auth.login', this.props.onLogin);
        }
      });
    } catch (err) {
      console.warn('unable to get fb login status: ', err);
      this.props.onError('facebookError');
      this.setState({ disabled: true });
    }
  }

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
        {..._.omit(this.props, ['onLogin', 'onError'])}
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
