import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Typography } from 'antd';
import PropTypes from 'prop-types';

import { ORCID } from 'common/constants';
import { allRedirectUris } from 'common/injectGlobals';
import ROUTES from 'common/routes';
import OrcidRedirect from 'components/Login/OrcidRedirect';
import useUser from 'hooks/useUser';
import { TRACKING_EVENTS, trackUserInteraction } from 'services/analyticsTracking';
import { manageUserTokenWithLoader } from 'store/actionCreators/user';
import { selectLoginProvider, selectUserToken } from 'store/selectors/users';
import Column from 'uikit/Column';

import SecurityError from './SecurityError';
import SocialButtons from './SocialButtons';

import './Login.module.css';
import { loginContainer } from './Login.module.css';

const { Text } = Typography;

const mapStateToProps = (state) => ({
  userToken: selectUserToken(state),
  loginProvider: selectLoginProvider(state),
});

const mapDispatchToProps = (dispatch) => ({
  manageUserTokenWithLoader: (jwt, provider, cb) =>
    dispatch(manageUserTokenWithLoader(jwt, provider, cb)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);

const Component = (props) => {
  // if we're redirecting from orcid oauth,
  //  or we're on a page and we're already logged in with orcid (i.e. /join)
  const { userToken, shouldNotRedirect, manageUserTokenWithLoader } = props;

  const [securityError, setSecurityError] = useState(false);

  const [errors, setError] = useState({
    thirdPartyDataError: false,
    facebookError: false,
    unknownError: false,
  });

  const { isAuthenticated } = useUser();

  const history = useHistory();

  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    //avoid flashing the page if one is already logged
    if (isAuthenticated) {
      history.push(ROUTES.dashboard);
    }
  }, [isAuthenticated, history]);

  const handleError = (errorField) =>
    setError((prevState) => ({
      ...prevState,
      [errorField]: true,
    }));

  const trackUserSignIn = (label) => {
    const actionType =
      pathname === '/join' ? TRACKING_EVENTS.categories.join : TRACKING_EVENTS.categories.signIn;
    trackUserInteraction({
      label,
      category: actionType,
      action: `${actionType} with Provider`,
    });
  };

  const handleToken = async ({ provider, handler, token }) => {
    let response;
    try {
      response = await handler(token);
    } catch (error) {
      if (error.message === 'Network Error') {
        setSecurityError(true);
      }
    }

    if ((response || {}).status === 200) {
      const rawJwt = response.data;
      manageUserTokenWithLoader(rawJwt, provider, () => history.push(ROUTES.dashboard));
      await trackUserSignIn(provider);
    }
  };

  const renderOrcidRedirect = location.pathname === '/orcid';

  const renderSocialLoginButtons =
    shouldNotRedirect || allRedirectUris.includes(window.location.origin);

  const disabled = Object.values(errors).some((err) => err);

  let content;
  if (securityError) {
    content = <SecurityError />;
  } else if (renderOrcidRedirect) {
    content = (
      <OrcidRedirect
        location={location}
        userToken={userToken}
        loginProvider={ORCID}
        onLogin={(token) =>
          handleToken({
            provider: ORCID,
            handler: () => Promise.resolve({ data: token, status: 200 }), // clean
            token,
          })
        }
      />
    );
  } else if (renderSocialLoginButtons) {
    content = (
      <SocialButtons
        disabled={disabled}
        handleToken={handleToken}
        handleError={handleError}
        thirdPartyDataError={errors.thirdPartyDataError}
        unknownError={errors.unknownError}
      />
    );
  } else {
    content = <Text>An error occurred. Please refresh and try again or contact our support.</Text>;
  }

  return (
    <Column className={`${loginContainer} ${disabled ? 'disabled' : ''}`} disabled={disabled}>
      {content}
    </Column>
  );
};

Component.propTypes = {
  shouldNotRedirect: PropTypes.bool,
  userToken: PropTypes.string,
  manageUserTokenWithLoader: PropTypes.func,
};
export default connector(Component);
