import React from 'react';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { css } from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import { Trans } from 'react-i18next';

import FacebookLogin from 'components/loginButtons/FacebookLogin';
import RedirectLogin from 'components/loginButtons/RedirectLogin';
import { ModalWarning } from 'components/Modal';

import { getSecret } from 'services/secrets';
import googleSDK from 'services/googleSDK';
import { withApi } from 'services/api';
import { logoutAll } from 'services/login';
import { trackUserInteraction } from 'services/analyticsTracking';
import { googleLogin, facebookLogin } from 'services/login';
import { getProfile, createProfile } from 'services/profiles';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { egoApiRoot } from 'common/injectGlobals';
import { allRedirectUris } from '../common/injectGlobals';
import { GEN3, CAVATICA } from 'common/constants';


const styles = {
  container: css`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    padding-bottom: 10px;
  `,
  googleSignin: css`
    margin-top: 0;
    margin-bottom: 10px;
  `,
};

const enhance = compose(injectState, withRouter, withApi);

export const validateJWT = ({ jwt }) => {
  if (!jwt) return false;
  const data = jwtDecode(jwt);
  const isCurrent = new Date(data.exp * 1000).valueOf() > Date.now();
  const isApproved =
    get(data, 'context.user.roles', []).includes('ADMIN') ||
    get(data, 'context.user.status') === 'Approved';
  return isCurrent && isApproved && data;
};

export const handleJWT = async ({ jwt, onFinish, setToken, setUser, api }) => {
  const jwtData = validateJWT({ jwt });
  if (!jwtData) {
    setToken(null);
  } else {
    try {
      await setToken(jwt);
      const user = jwtData.context.user;
      const egoId = jwtData.sub;
      const existingProfile = await getProfile(api)({ egoId });
      const newProfile = !existingProfile ? await createProfile(api)({ ...user, egoId }) : {};
      const loggedInUser = {
        ...(existingProfile || newProfile),
        email: user.email,
      };
      await setUser({ ...loggedInUser, api });
      onFinish && onFinish(loggedInUser);
    } catch (err) {
      console.error(err);
    }
  }
  return jwtData;
};

/**
 * fetchIntegrationTokens
 * For all SERVICES listed in common/constants, call the key-store to retrieve any keys stored
 *  for the user.
 * Each call to key-store is resolved separately and asynchronously. Their value will be added
 *  to state once returned.
 */
export const fetchIntegrationTokens = ({ setIntegrationToken }) => {
  getCavaticaUser()
    .then(userData => {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
    })
    .catch(response => {
      // Could not retrieve cavatica user info, nothing to do.
    });

  // Get Gen3 Secret here
  getSecret({ service: GEN3 })
    .then(data => {
      setIntegrationToken(GEN3, JSON.stringify(data));
    })
    .catch(res => {
      console.error('Error getting Gen3 API Key');
      console.error(res);
    });
};

class Component extends React.Component<any, any> {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
    api: PropTypes.func,
  };
  state = {
    authorizationError: false,
    securityError: false,
  };
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
          this.handleGoogleToken(id_token);
        },
        onfailure: error => global.log('login fail', error),
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
      this.trackUserSignIn('Facebook');
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
      this.trackUserSignIn('Google');
      this.handleLoginResponse(response);
    }
  };
  handleLoginResponse = async response => {
    const { api } = this.props;
    if (response.status === 200) {
      const jwt = response.data;
      const props = this.props;
      const {
        onFinish,
        effects: { setToken, setUser, setIntegrationToken },
      } = props;
      if (await handleJWT({ jwt, onFinish, setToken, setUser, api })) {
        fetchIntegrationTokens({ setIntegrationToken });
      } else {
        await logoutAll();
        this.setState({ authorizationError: true });
      }
    } else {
      console.warn('response error');
    }
  };
  trackUserSignIn = (provider) => {
    let { location: {pathname} } = this.props;
    let actionType = pathname === '/join' ? 'Join' : 'Log In';
      trackUserInteraction({
        category: actionType,
        action: `${actionType} with Provider`,
        label: provider
      })
  };
  handleSecurityError = () => this.setState({ securityError: true });

  render() {
    const renderSocialLoginButtons =
      this.props.shouldNotRedirect || allRedirectUris.includes(window.location.origin);
    return (
      <div className={styles.container}>
        {this.state.securityError ? (
          <div style={{ maxWidth: 600 }}>
            <Trans i18nKey="login.connectionFailed">
              Connection to ego failed, you may need to visit
              <a target="_blank" href={egoApiRoot}>
                {{ egoApiRoot }}
              </a>
              in a new tab and accept the warning
            </Trans>
          </div>
        ) : renderSocialLoginButtons ? (
          <React.Fragment>
            {this.state.authorizationError && (
              <ModalWarning>
                <Trans key="login.authorizationError">
                  The Kids First DRP is currently in the internal review phase and is not accessible
                  for beta testing. Please{' '}
                  <a href="mailto:support@kidsfirstdrc.org">contact a Kids First administrator</a>{' '}
                  if you have registered for internal review and are not able to log in.
                </Trans>
              </ModalWarning>
            )}
            <div key="google" className={styles.googleSignin} id="googleSignin" />
            <FacebookLogin key="facebook" onLogin={this.onFacebookLogin} />
          </React.Fragment>
        ) : (
          <RedirectLogin onLogin={({ token }) => this.handleJWT(token)} />
        )}
      </div>
    );
  }
}

export default enhance(Component);
