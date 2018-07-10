import { gen3ApiRoot, oauthRedirectUrl, gen3IntegrationRoot } from 'common/injectGlobals';

import { GEN3 } from 'common/constants';
import { trackUserInteraction, TRACKING_EVENTS } from 'services/analyticsTracking';
import { getUser as getGen3User } from 'services/gen3';
import { deleteSecret, setSecret } from 'services/secrets';

const AUTHORIZE_URL = `${gen3ApiRoot}user/oauth2/authorize`;
const CLIENT_URL = `${`${gen3IntegrationRoot}/auth-client`}`;
const TOKEN_URL = `${`${gen3IntegrationRoot}/token`}`;
const REDIRECT_URI = oauthRedirectUrl;
const RESPONSE_TYPE = 'code';

export const submitGen3Token = async ({ token, setIntegrationToken, onSuccess, onFail }) => {
  const apiKey = token.replace(/\s+/g, '');
  await setSecret({ service: GEN3, secret: apiKey });
  getGen3User(apiKey)
    .then(userData => {
      setIntegrationToken(GEN3, apiKey);
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.connected,
        label: 'Gen3',
      });
      onSuccess(userData);
    })
    .catch(response => {
      setIntegrationToken(GEN3, null);
      deleteSecret({ service: GEN3 });
      trackUserInteraction({
        category: TRACKING_EVENTS.categories.user.profile,
        action: TRACKING_EVENTS.actions.integration.failed,
        label: 'Gen3',
      });
      onFail(response);
    });
};

export const connectGen3 = ({ loggedInUser, setIntegrationToken }) =>
  fetch(CLIENT_URL)
    .then(res => res.json())
    .then(
      ({ client_id, scope }) =>
        new Promise((resolve, reject) => {
          const authWindow = window.open(
            `${AUTHORIZE_URL}?client_id=${client_id}&response_type=${RESPONSE_TYPE}&scope=${scope}&redirect_uri=${REDIRECT_URI}`,
          );
          authWindow.addEventListener('message', e => {
            const { data } = e;
            switch (data.type) {
              case 'OAUTH_SUCCESS':
                const code = data.payload;
                // fetch(`${TOKEN_URL}/?code=${code.split(' ').join('')}`, {
                //   method: 'POST',
                //   headers: {
                //     authorization: `Bearer ${localStorage.EGO_JWT}`,
                //     'Content-Type': `application/json`,
                //   },
                // })
                fetch(`http://localhost:9999/authenticate/${code}`).then(res => res.json());
                break;
              case `OAUTH_FAIL`:
                reject(data);
                break;
              default:
                console.log('default: ', data);
            }
          });
        }),
    );
