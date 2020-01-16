import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { injectState } from 'freactal';

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

import { allRedirectUris, egoApiRoot, orcidAuthAppId } from 'common/injectGlobals';
import { GOOGLE, FACEBOOK, ORCID, LOGIN_ERROR_DETAILS } from 'common/constants';

import { handleJWT, fetchIntegrationTokens } from './utils';

import './Login.module.css';
import { loginContainer, loginError } from './Login.module.css';

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
      // [NEXT] TEST THIS (see if a space is lost around 'Contact us')
      return (
        <React.Fragment>
          Uh oh, looks like something went wrong.
          <ExternalLink
            hasExternalIcon={false}
            href="https://kidsfirstdrc.org/contact"
            target="_blank"
          >
            &nbsp;Contact us&nbsp;
          </ExternalLink>
          and we will help investigate why you are unable to sign in.
        </React.Fragment>
      );
    } else if (thirdPartyDataError) {
      return LOGIN_ERROR_DETAILS.thirdPartyData;
    } else {
      return LOGIN_ERROR_DETAILS.facebook;
    }
  };

  renderSecurityError() {
    return (
      <Box style={{ maxWidth: '600px' }}>
        Connection to ego failed, you may need to visit
        <a target="_blank" rel="noopener noreferrer" href={egoApiRoot}>
          { egoApiRoot }
        </a>
        in a new tab and accept the warning
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
            The Kids First Portal is currently in early access beta, please register at{' '}
            <ExternalLink href="https://kidsfirstdrc.org/portal/">
              https://kidsfirstdrc.org/portal/
            </ExternalLink>{' '}
            if you are interested in participating. For any questions, or if you already have access
            to Kids First datasets via dbGaP, please contact
            <a href="mailto:support@kidsfirstdrc.org">support@kidsfirstdrc.org</a>.
          </ModalWarning>
        )}

        {disabled ? (
          <PromptMessageContainer p="15px" pr="26px" mb="15px" mr="0" error>
            <PromptMessageContent pt={0}>
              <Box className={`${loginError} greyScale1`}>{this.getErrorMessage()}</Box>
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

    return (
      <Column className={`${loginContainer} ${disabled ? 'disabled' : ''}`} disabled={disabled}>
        {content}
      </Column>
    );
  }
}

export default compose(injectState, withRouter, withApi)(Component);
