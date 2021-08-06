import React from 'react';

import { FACEBOOK, GOOGLE, LOGIN_ERROR_DETAILS } from 'common/constants';
import { orcidAuthAppId } from 'common/injectGlobals';
import FacebookLogin from 'components/loginButtons/FacebookLogin';
import GoogleLogin from 'components/loginButtons/GoogleLogin';
import OrcidLogin from 'components/loginButtons/OrcidLogin';
import ExternalLink from 'uikit/ExternalLink';
import { PromptMessageContainer, PromptMessageContent } from 'uikit/PromptMessage';

import { facebookLogin, googleLogin } from '../../services/login';
import { Provider } from '../../store/userTypes';
import { Nullable } from '../../store/utilityTypes';
import { Box } from '../../uikit/Core';

// @ts-ignore
import { loginError } from './Login.module.css';

type Props = {
  disabled: boolean;
  handleToken: ({
    provider,
    handler,
    token,
  }: {
    provider: Provider;
    handler: (t: string) => Promise<any>;
    token: string;
  }) => Promise<void>;
  handleError: (e: string) => void;
  thirdPartyDataError: Nullable<Error>;
  unknownError: Nullable<Error>;
};

const SocialButtons = (props: Props) => {
  const { disabled, handleToken, handleError, thirdPartyDataError, unknownError } = props;
  const orcidLoginEnabled = Boolean(orcidAuthAppId);

  const getErrorMessage = () => {
    if (unknownError) {
      return (
        <>
          Uh oh, looks like something went wrong.
          {/* @ts-ignore */}
          <ExternalLink
            hasExternalIcon={false}
            href="https://kidsfirstdrc.org/contact"
            target="_blank"
          >
            &nbsp;Contact us&nbsp;
          </ExternalLink>
          and we will help investigate why you are unable to sign in.
        </>
      );
    } else if (thirdPartyDataError) {
      return LOGIN_ERROR_DETAILS.thirdPartyData;
    } else {
      return LOGIN_ERROR_DETAILS.facebook;
    }
  };

  return (
    <div className="login-buttons-container">
      {disabled ? (
        <>
          {/* @ts-ignore*/}
          <PromptMessageContainer p="15px" pr="26px" mb="15px" mr="0" error>
            <PromptMessageContent pt={0}>
              <Box className={`${loginError} greyScale1`}>{getErrorMessage()}</Box>
            </PromptMessageContent>
          </PromptMessageContainer>
        </>
      ) : null}

      <GoogleLogin
        onError={handleError}
        onLogin={(id_token: string) =>
          handleToken({
            provider: GOOGLE,
            handler: googleLogin,
            token: id_token,
          })
        }
      />

      <FacebookLogin
        onError={handleError}
        onLogin={(r: any) =>
          handleToken({
            provider: FACEBOOK,
            handler: facebookLogin,
            token: r.authResponse.accessToken,
          })
        }
      />

      {orcidLoginEnabled ? <OrcidLogin /> : null}
    </div>
  );
};

export default SocialButtons;
