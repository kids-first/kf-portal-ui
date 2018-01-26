import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import { googleLogin, facebookLogin } from 'services/login';
import FacebookLogin from 'components/loginButtons/FacebookLogin';
import RedirectLogin from 'components/loginButtons/RedirectLogin';

import { getProfile, createProfile } from 'services/profiles';
import { googleAppId, egoApiRoot } from 'common/injectGlobals';
import { allRedirectUris } from '../common/injectGlobals';

const styles = {
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  logo: {
    marginLeft: 80,
  },
  loginIcon: {
    width: 20,
  },
  googleSignin: {
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontWeight: 400,
  },
};

const gapi = global.gapi;

const enhance = compose(injectState, withRouter);

class Component extends React.Component<any, any> {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
  };
  state = {
    securityError: false,
  };
  componentDidMount() {
    try {
      gapi.load('auth2', () => {
        /**
         * Retrieve the singleton for the GoogleAuth library and set up the
         * client.
         */
        gapi.auth2.init({
          client_id: googleAppId,
        });
        gapi.signin2.render('googleSignin', {
          scope: 'profile email',
          width: 240,
          height: 40,
          longtitle: true,
          theme: 'light',
          onsuccess: googleUser => {
            const { id_token } = googleUser.getAuthResponse();
            this.handleGoogleToken(id_token);
          },
          onfailure: error => global.log('login fail', error),
        });
      });
    } catch (e) {
      global.log(e);
    }
  }
  onFacebookLogin = response => {
    this.handleFacebookToken(response.authResponse.accessToken);
  };
  handleFacebookToken = async token => {
    const response = await facebookLogin(token).catch(error => {
      if (error.message === 'Network Error') {
        this.handleSecurityError();
      }
    });

    if (response) {
      this.handleLoginResponse(response);
    }
  };
  handleGoogleToken = async token => {
    const response = await googleLogin(token).catch(error => {
      if (error.message === 'Network Error') {
        this.handleSecurityError();
      }
    });

    if (response) {
      this.handleLoginResponse(response);
    }
  };
  handleLoginResponse = async response => {
    if (response.status === 200) {
      const jwt = response.data;
      this.handleJWT(jwt);
    } else {
      console.warn('response error');
    }
  };
  handleJWT = async jwt => {
    const props = this.props;
    const data = jwtDecode(jwt);
    const user = data.context.user;
    const egoId = data.sub;
    await props.effects.setToken(jwt);
    const existingProfile = await getProfile({ egoId });
    const newProfile = !existingProfile ? await createProfile({ ...user, egoId }) : {};
    await props.effects.setUser({
      ...(existingProfile || newProfile),
      email: user.email,
    });

    if (Object.keys(newProfile).length > 0) {
      this.props.history.push('/select-role');
    }
  };
  handleSecurityError() {
    this.setState({
      securityError: true,
    });
  }

  render() {
    const renderSocialLoginButtons =
      this.props.shouldNotRedirect || allRedirectUris.includes(window.location.origin);

    return (
      <div className={`Login ${css(styles.container)}`}>
        {this.state.securityError ? (
          <div style={{ maxWidth: 600 }}>
            Connection to ego failed, you may need to visit{' '}
            <a target="_blank" href={egoApiRoot}>
              {egoApiRoot}
            </a>{' '}
            in a new tab and accept the warning
          </div>
        ) : renderSocialLoginButtons ? (
          [
            <div key="google" className={`${css(styles.googleSignin)}`} id="googleSignin" />,
            <FacebookLogin key="facebook" onLogin={this.onFacebookLogin} />,
          ]
        ) : (
          <RedirectLogin onLogin={({ token }) => this.handleJWT(token)} />
        )}
      </div>
    );
  }
}

export default enhance(Component);
