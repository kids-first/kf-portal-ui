import React from 'react';
import { withRouter } from 'react-router-dom';
import { get, isArrayLikeObject, toLower } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import jwtDecode from 'jwt-decode';
import { Trans } from 'react-i18next';
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
    .catch(response => {
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

const LoginContainer = styled(Column)`
  ${({ theme }) => theme.center};
  background-color: ${({ theme }) => theme.white};
  height: 100%;
  width: 100%;
  padding-bottom: 10px;
  margin-top: ${props => (props.disabled ? '11px' : '40px')};
`;

const LoginError = styled(Box)`
  color: ${({ theme }) => theme.greyScale1};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.details};
  font-size: 14px;
  line-height: 1.7;
`;

class Component extends React.Component {
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

  getErrorMessage = () => {
    const { thirdPartyDataError, unknownError } = this.state;
    if (unknownError) {
      return reactStringReplace(LOGIN_ERROR_DETAILS.unknown, 'Contact us', (match, i) => (
        <ExternalLink
          hasExternalIcon={false}
          href="https://kidsfirstdrc.org/contact"
          target="_blank"
          key={`link-${i}`}
        >
          Contact us
        </ExternalLink>
      ));
    } else if (thirdPartyDataError) {
      return LOGIN_ERROR_DETAILS.thirdPartyData;
    } else {
      return LOGIN_ERROR_DETAILS.facebook;
    }
  };

  renderSecurityError() {
    return (
      <Box maxWidth={600}>
        <Trans i18nKey="login.connectionFailed">
          Connection to ego failed, you may need to visit
          <a target="_blank" href={egoApiRoot}>
            {{ egoApiRoot }}
          </a>
          in a new tab and accept the warning
        </Trans>
      </Box>
    );
  }

  renderOrcidRedirect() {
    return (
      <OrcidRedirect
        location={this.props.location}
        loggedInUserToken={this.props.state.loggedInUserToken}
        loginProvider={this.props.state.loginProvider}
        onLogin={token =>
          this.handleToken({
            provider: ORCID,
            handler: () => Promise.resolve({ data: token, status: 200 }), // clean
            token,
          })
        }
      />
    );
  }

  renderSocialLoginButtons(disabled) {
    const orcidLoginEnabled = Boolean(orcidAuthAppId);

    return (
      <div className="login-buttons-container">
        {this.state.authorizationError && (
          <ModalWarning>
            <Trans key="login.authorizationError">
              The Kids First Portal is currently in early access beta, please register at{' '}
              <ExternalLink href="https://kidsfirstdrc.org/portal/">
                https://kidsfirstdrc.org/portal/
              </ExternalLink>{' '}
              if you are interested in participating. For any questions, or if you already have
              access to Kids First datasets via dbGaP, please contact
              <a href="mailto:support@kidsfirstdrc.org">support@kidsfirstdrc.org</a>.
            </Trans>
          </ModalWarning>
        )}

        {disabled ? (
          <PromptMessageContainer p="15px" pr="26px" mb="15px" mr="0" error>
            <PromptMessageContent pt={0}>
              <LoginError>{this.getErrorMessage()} </LoginError>
            </PromptMessageContent>
          </PromptMessageContainer>
        ) : null}

        <GoogleLogin
          onError={this.handleError}
          onLogin={id_token =>
            this.handleToken({
              provider: GOOGLE,
              handler: googleLogin,
              token: id_token,
            })
          }
        />

        <FacebookLogin
          onError={this.handleError}
          onLogin={r =>
            this.handleToken({
              provider: FACEBOOK,
              handler: facebookLogin,
              token: r.authResponse.accessToken,
            })
          }
        />

        {orcidLoginEnabled ? <OrcidLogin /> : null}
      </div>
    );
  }

  render() {
    // if we're redirecting from orcid oauth,
    //  or we're on a page and we're already logged in with orcid (i.e. /join)
    const renderOrcidRedirect =
      this.props.location.pathname === '/orcid' ||
      (this.props.state.loggedInUserToken && this.props.state.loginProvider === ORCID);

    const renderSocialLoginButtons =
      this.props.shouldNotRedirect || allRedirectUris.includes(window.location.origin);

    const { thirdPartyDataError, facebookError, unknownError } = this.state;
    const disabled = thirdPartyDataError || facebookError || unknownError;

    let content = null;
    if (this.state.securityError) {
      content = this.renderSecurityError();
    } else if (renderOrcidRedirect) {
      content = this.renderOrcidRedirect();
    } else if (renderSocialLoginButtons) {
      content = this.renderSocialLoginButtons(disabled);
    } else {
      content = <RedirectLogin onLogin={({ token }) => this.handleJWT(token)} />;
    }

    return <LoginContainer disabled={disabled}>{content}</LoginContainer>;
  }
}

export default compose(
  injectState,
  withRouter,
  withApi,
)(Component);
