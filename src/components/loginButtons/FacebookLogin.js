/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Spin } from 'antd';

import { facebookStatus } from 'services/login';

import DisabledFacebookLogin from './DisabledFacebookLogin';

export default class FacebookLogin extends Component {
  state = {
    disabled: false,
    isLoading: false,
  };

  componentDidMount() {
    this.setState({ isLoading: true });
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
      })
      .finally(() => this.setState({ isLoading: false }));
  }

  componentWillUnmount() {
    try {
      global.FB.Event.unsubscribe('auth.login', this.props.onLogin);
    } catch (err) {
      console.warn('unable to unsubscribe to fb event: ', err);
    }
  }

  render() {
    return (
      <Spin spinning={this.state.isLoading}>
        {this.state.disabled ? (
          <DisabledFacebookLogin />
        ) : (
          <div
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
        )}
      </Spin>
    );
  }
}
