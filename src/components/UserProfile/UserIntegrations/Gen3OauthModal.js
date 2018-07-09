import * as React from 'react';
import IframeComm from 'react-iframe-comm';
import Component from 'react-component-component';
import { injectState } from 'freactal';
import { gen3ApiRoot, oauthRedirectUrl } from 'common/injectGlobals';

export default injectState(({ onSuccess = () => {}, state: { loggedInUser } }) => {
  const AUTHORIZE_URL = `${gen3ApiRoot}user/oauth2/authorize`;
  const TOKEN_URL = `${`https://v2i1r42t6d.execute-api.us-east-1.amazonaws.com/beta/authenticate`}`;
  const CLIENT_ID = 'V3TPPDDL2T180uPTGy0bZID114KPsd0jczi0DoxV';
  const REDIRECT_URI = oauthRedirectUrl;
  const SCOPE = 'openid';
  const RESPONSE_TYPE = 'code';

  return (
    <Component
      initialState={{
        error: null,
      }}
    >
      {({ state: { error }, setState }) =>
        error ? (
          'Something went wrong, please try again later'
        ) : (
          <IframeComm
            attributes={{
              src: `${AUTHORIZE_URL}?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}`,
              height: 600,
            }}
            handleReceiveMessage={e => {
              const { data } = e;
              switch (data.type) {
                case 'OAUTH_SUCCESS':
                  // onSuccess({ code: data.payload });
                  const code = data.payload;
                  console.log('code: ', code);
                  fetch(`${TOKEN_URL}/${code}`)
                    .then(res => res.text())
                    .then(console.log);
                  break;
                default:
                  setState({ error: true });
              }
            }}
          />
        )
      }
    </Component>
  );
});
