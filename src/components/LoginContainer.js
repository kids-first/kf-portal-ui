import React from 'react';
import { withRouter } from 'react-router-dom';
import { get, isArrayLikeObject, toLower } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import reactStringReplace from 'react-string-replace';

import FacebookLogin from 'components/loginButtons/FacebookLogin';
import GoogleLogin from 'components/loginButtons/GoogleLogin';
import OrcidLogin from 'components/loginButtons/OrcidLogin';
import OrcidRedirect from 'components/Login/OrcidRedirect';
import RedirectLogin from 'components/loginButtons/RedirectLogin';
import { ModalWarning } from 'components/Modal';
import { Box } from 'uikit/Core';
import Column from 'uikit/Column';
import ExternalLink from 'uikit/ExternalLink';
import { PromptMessageContainer, PromptMessageContent } from 'uikit/PromptMessage';

import { withApi } from 'services/api';
import { logoutAll } from 'services/login';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { googleLogin, facebookLogin } from 'services/login';
import { getProfile, createProfile } from 'services/profiles';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { allRedirectUris, egoApiRoot, orcidAuthAppId } from 'common/injectGlobals';
import { FENCES, CAVATICA, GOOGLE, FACEBOOK, ORCID, LOGIN_ERROR_DETAILS } from 'common/constants';
import { getAccessToken } from 'services/fence';
import { createExampleQueries } from 'services/riffQueries';

import { store } from '../store';
import { loginSuccess, loginFailure } from '../store/actionCreators/user';
/** TODO extract into another file */
export const isAdminToken = ({ validatedPayload }) => {
  if (!validatedPayload) return false;
  const jwtUser = get(validatedPayload, 'context.user', {});
  const roles = jwtUser.roles;
  const type = jwtUser.type;
  // maintain backward compatibility
  return roles && null !== roles && isArrayLikeObject(roles)
    ? roles.includes('ADMIN')
    : type && type !== null && type === 'ADMIN';
};

export const validateJWT = ({ jwt }) => {
  if (!jwt) return false;
  const validatedPayload = jwtDecode(jwt);
  const isCurrent = new Date(validatedPayload.exp * 1000).valueOf() > Date.now();
  const status = get(validatedPayload, 'context.user.status', '');
  const isApproved =
    isAdminToken({ validatedPayload }) || [status].map(toLower).includes('approved');
  return isCurrent && isApproved && validatedPayload;
};

const initProfile = async (api, user, egoId) => {
  const profileCreation = createProfile(api)({ ...user, egoId });
  const sampleQueryCreation = createExampleQueries(api, egoId);
  const [x] = await Promise.all([profileCreation, sampleQueryCreation]);
  return x;
};

export const handleJWT = async ({ provider, jwt, onFinish, setToken, setUser, api }) => {
  const jwtData = validateJWT({ jwt });

  if (!jwtData) {
    setToken();
    // clear the user details in the redux store
    store.dispatch(loginFailure());
  } else {
    try {
      await setToken({ token: jwt, provider });
      const user = jwtData.context.user;
      const egoId = jwtData.sub;
      const existingProfile = await getProfile(api)();
      const newProfile = !existingProfile ? await initProfile(api, user, egoId) : {};
      const loggedInUser = {
        ...(existingProfile || newProfile),
        email: user.email,
        egoGroups: user.groups,
      };
      await setUser({ ...loggedInUser, api });
      onFinish && onFinish(loggedInUser);

      // store the user details in the redux store
      store.dispatch(loginSuccess(loggedInUser));
    } catch (err) {
      console.error('Error during login', err);
      // clear the user details in the redux store
      store.dispatch(loginFailure());
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
export const fetchIntegrationTokens = ({ setIntegrationToken, api }) => {
  getCavaticaUser()
    .then(userData => {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
    })
    .catch(error => {
      console.error(error);
      // Could not retrieve cavatica user info, nothing to do.
    });

  // Get Gen3 Secret here
  FENCES.forEach(fence => {
    getAccessToken(api, fence)
      .then(key => {
        setIntegrationToken(fence, key);
      })
      .catch(res => {
        console.error('Error getting Gen3 API Key');
        console.error(res);
      });
  });
};

class LoginContainer extends React.Component {
  static propTypes = {
    effects: PropTypes.object,
    state: PropTypes.object,
    api: PropTypes.func,
  };

  state = {
    authorizationError: false,
    securityError: false,
    thirdPartyDataError: false,
    facebookError: false,
    unknownError: false,
  };

  handleToken = async ({ provider, handler, token }) => {
    const {
      api,
      onFinish,
      effects: { setToken, setUser, setIntegrationToken },
    } = this.props;

    const response = await handler(token).catch(error => {
      if (error.message === 'Network Error') {
        this.handleSecurityError();
      }
    });

    if ((response || {}).status === 200) {
      return handleJWT({ provider, jwt: response.data, onFinish, setToken, setUser, api })
        .then(async success => {
          if (success) {
            this.trackUserSignIn(provider);
            fetchIntegrationTokens({ setIntegrationToken, api });
          } else {
            await logoutAll();
            this.setState({ authorizationError: true });
          }
        })
        .catch(async error => {
          await logoutAll();
          this.setState({ authorizationError: true });
        });
    }
  };

  trackUserSignIn = label => {
    let {
      location: { pathname },
    } = this.props;
    let actionType =
      pathname === '/join' ? TRACKING_EVENTS.categories.join : TRACKING_EVENTS.categories.signIn;
    trackUserInteraction({
      label,
      category: actionType,
      action: `${actionType} with Provider`,
    });
  };

  handleSecurityError = () => this.setState({ securityError: true });

  handleError = errorField => this.setState({ [errorField]: true });

  render() {
    return null;
  }
}

export default compose(
  injectState,
  withRouter,
  withApi,
)(LoginContainer);
