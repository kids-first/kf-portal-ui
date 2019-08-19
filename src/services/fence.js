import jwtDecode from 'jwt-decode';
import { uniq } from 'lodash';
import { FENCES, GEN3, DCF } from 'common/constants';

import {
  fenceAuthClientUri,
  fenceRefreshUri,
  fenceTokensUri,
  gen3ApiRoot,
  dcfApiRoot,
} from 'common/injectGlobals';

const RESPONSE_TYPE = 'code';

const GEN3_SCOPE = 'openid+data+user';
const DCF_SCOPE = 'openid+user';
const getScope = fence => {
  switch (fence) {
    case GEN3:
      return GEN3_SCOPE;
    case DCF:
      return DCF_SCOPE;
    default:
      return '';
  }
};

// Fetch all fence auth_client details on page load for pages needing the fence API.
//  When connecting to a fence, the window.open call has to happen in the same synchronus callstack
//  as the event handler, so client_id and redirect_uri must be available at all times.
const PROVIDERS = {
  gen3: { fenceUri: gen3ApiRoot },
  dcf: { fenceUri: dcfApiRoot },
};
FENCES.forEach(fence => {
  const authCliUri = `${fenceAuthClientUri}?fence=${fence}`;
  fetch(authCliUri)
    .then(res => res.json())
    .then(({ client_id, redirect_uri }) => {
      PROVIDERS[fence].clientId = client_id;
      PROVIDERS[fence].redirectUri = redirect_uri;
    });
});

/*
 * Connect To A Fence
 *  Opens a new tab/window that calls to fence provider, sending our client ID and redirect URL
 *  Then this starts a 1 second repeating interval that checks for a new api token in the key manager
 *  This lasts for 1 Minute before failing outright (no effect or state change)
 */
export const fenceConnect = (api, fence) => {
  const { clientId, redirectUri, fenceUri } = PROVIDERS[fence];
  const scope = getScope(fence);
  const url = `${fenceUri}user/oauth2/authorize?client_id=${clientId}&response_type=${RESPONSE_TYPE}&scope=${scope}&redirect_uri=${redirectUri}`;
  const authWindow = window.open(url);
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (authWindow.closed) {
        getAccessToken(api, fence)
          .then(access_token => {
            if (access_token) {
              clearInterval(interval);
              resolve(access_token);
            }
          })
          .catch(err => {
            clearInterval(interval);
            reject({ msg: 'Error occurred while fetching Fence Access Token.' });
          });
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      reject('nothing');
    }, 1000 * 60 * 10);
  });
};

/*
 * Fetch Access Token
 *  If access token is expired, call the refresh token method
 */
const getRefreshedToken = async (api, fence) =>
  api({
    method: 'POST',
    url: `${fenceRefreshUri}?fence=${fence}`,
  })
    .then(data => {
      if (data.access_token) {
        return data;
      } else {
        return fenceConnect(api, fence);
      }
    })
    .then(({ access_token }) => access_token);

export const getAccessToken = async (api, fence) => {
  const currentToken = await api({
    method: 'GET',
    url: `${fenceTokensUri}?fence=${fence}`,
  }).then(({ access_token }) => access_token);
  const { exp } = jwtDecode(currentToken);
  return exp * 1000 > Date.now() ? currentToken : await getRefreshedToken(api, fence);
};

export const convertTokenToUser = accessToken => {
  const {
    context: { user },
  } = jwtDecode(accessToken);
  return user;
};

/*
 * Get User
 */
export const getFenceUser = async (api, fence) => {
  let accessToken = await getAccessToken(api, fence);
  const user = convertTokenToUser(accessToken);
  return user;
};

/*
 * Delete Tokens (Disconnect)
 */
export const deleteFenceTokens = async (api, fence) => {
  await api({
    method: 'DELETE',
    url: `${fenceTokensUri}?fence=${fence}`,
  });
};

/*
 * Download File From a Fence Data Repository
 */
export const downloadFileFromFence = async ({ fileUuid, api, fence }) => {
  let accessToken = null;
  try {
    accessToken = await getAccessToken(api, fence);
  } catch (err) {
    // Open access files are accessible even when not logged with a fence, so assume access and let the download fail.
    console.warn(`[Fence] no access token for file ${fileUuid}, assuming open access`);
  }

  const { fenceUri } = PROVIDERS[fence];
  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : {};
  const { url } = await fetch(`${fenceUri}user/data/download/${fileUuid}`, {
    headers,
  }).then(res => res.json());
  if (!url) {
    return null;
  }
  return url;
};

/*
 * Get list of authorized studies for a user
 */
const toStudyId = consentCode => consentCode.split('.')[0];
export const getStudyIds = fenceUser => uniq(Object.keys(fenceUser.projects).map(toStudyId));
