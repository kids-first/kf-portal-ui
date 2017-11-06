import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import { googleLogin, facebookLogin } from 'services/login';
import FacebookLogin from 'components/FacebookLogin';

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
          onfailure: error => console.log('login fail', error),
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
    console.log(token);
    const response = await googleLogin(token);
    this.handleLoginResponse(response);
  };
  handleLoginResponse = async response => {
    const props = this.props as any;

    if (response.status === 200) {
      const jwt = response.data;
      const user = jwtDecode(jwt).context.user;
      await props.effects.setUser(user);
      await props.effects.setToken(jwt);

      if (user.roles.includes('ADMIN')) {
        if (props.match.path === '/') {
          props.history.push('/users');
        }
      } else {
        props.history.push('/no-access');
      }
    } else {
      console.warn('response error');
    }
  };

  render() {
    return (
      <div className={`Login ${css(styles.container)}`}>
        <h1 className={`${css(styles.title)}`}>Portal</h1>
        <div className={`${css(styles.googleSignin)}`} id="googleSignin" />
        <FacebookLogin onLogin={this.onFacebookLogin} />
      </div>
    );
  }
}

export default enhance(Component);