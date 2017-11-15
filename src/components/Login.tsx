import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import { googleLogin, facebookLogin } from 'services/login';
import FacebookLogin from 'components/FacebookLogin';
import { getProfile, createProfile } from 'services/profiles';
import { apiRoot } from 'common/injectGlobals';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_APP_ID;

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
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontWeight: 400,
  },
};

const gapi = global.gapi;

const enhance = compose(injectState);

class Component extends React.Component {
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
          client_id: GOOGLE_CLIENT_ID,
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
    const response = await facebookLogin(token);
    this.handleLoginResponse(response);
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
    const props = this.props as any;

    if (response.status === 200) {
      const jwt = response.data;
      const data = jwtDecode(jwt);
      const user = data.context.user;
      const egoId = data.sub;
      const profile = (await getProfile({ egoId })) || (await createProfile({ ...user, egoId }));

      await props.effects.setUser(profile);
      await props.effects.setToken(jwt);
    } else {
      console.warn('response error');
    }
  };
  handleSecurityError() {
    this.setState({
      securityError: true,
    });
  }

  render() {
    return (
      <div className={`Login ${css(styles.container)}`}>
        <h1 className={`${css(styles.title)}`}>Hello Portal</h1>
        {this.state.securityError ? (
          <div style={{ maxWidth: 600 }}>
            Connection to ego failed, you may need to visit{' '}
            <a target="_blank" href={apiRoot}>
              {apiRoot}
            </a>{' '}
            in a new tab and accept the warning
          </div>
        ) : (
          [
            <div key="google" className={`${css(styles.googleSignin)}`} id="googleSignin" />,
            <FacebookLogin key="facebook" onLogin={this.onFacebookLogin} />,
          ]
        )}
      </div>
    );
  }
}

export default enhance(Component);
