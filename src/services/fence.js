import jwtDecode from 'jwt-decode';
import uniq from 'lodash/uniq';

import {
  dcfApiRoot,
  fenceAuthClientUri,
  fenceRefreshUri,
  fenceTokensUri,
  gen3ApiRoot,
  idp,
} from 'common/injectGlobals';
import ajax from 'services/ajax';
import { FenceName } from 'store/fenceTypes';
import { isDecodedJwtExpired } from 'store/tokenUtils';

const DCF = FenceName.dcf;
const GEN3 = FenceName.gen3;

const RESPONSE_TYPE = 'code';

const GEN3_SCOPE = 'openid+data+user';
const DCF_SCOPE = 'openid+user';

const getScope = (fence) => {
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

/*
 * Connect To A Fence
 *  Opens a new tab/window that calls to fence provider, sending our client ID and redirect URL
 *  Then this starts a 1 second repeating interval that checks for a new api token in the key manager
 *  This lasts for 1 Minute before failing outright (no effect or state change)
 */
const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

export const fenceConnect = async (api, fence) => {
  const authCliUri = `${fenceAuthClientUri}?fence=${fence}`;
  const authCliRawResponse = await fetch(authCliUri);
  const authCliResponse = await authCliRawResponse.json();
  const redirectUri = authCliResponse.redirect_uri;
  const clientId = authCliResponse.client_id;

  const { fenceUri } = PROVIDERS[fence];
  const scope = getScope(fence);
  // eslint-disable-next-line max-len
  const url = `${fenceUri}user/oauth2/authorize?client_id=${clientId}&response_type=${RESPONSE_TYPE}&scope=${scope}&redirect_uri=${redirectUri}&idp=${idp}`;
  const authWindow = window.open(url);
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      if (authWindow.closed) {
        try {
          const token = await fetchTokenThenRefreshIfNeeded(api, fence);
          clearInterval(interval);
          resolve(token);
        } catch (e) {
          clearInterval(interval);
          reject({ msg: 'Error occurred while fetching Fence Access Token.' });
        }
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      reject('nothing');
    }, TEN_MINUTES_IN_MS);
  });
};

export const fetchAccessToken = async (api, fenceName) => {
  const data = await api({
    method: 'GET',
    url: `${fenceTokensUri}?fence=${fenceName}`,
  });
  return data.access_token;
};

export const fetchRefreshedAccessToken = async (api, fenceName) => {
  const data = await api({
    method: 'POST',
    url: `${fenceRefreshUri}?fence=${fenceName}`,
  });
  return data.access_token;
};

const fetchTokenThenRefreshIfNeeded = async (api, fenceName) => {
  let token = await fetchAccessToken(api, fenceName);
  const decodedToken = jwtDecode(token);
  if (isDecodedJwtExpired(decodedToken)) {
    token = await fetchRefreshedAccessToken(api, fenceName);
  }
  return token;
};

export const fetchFenceConnection = async (api, fenceName) => {
  const token = await fetchTokenThenRefreshIfNeeded(api, fenceName);
  const { fenceUri } = PROVIDERS[fenceName];
  const response = await ajax.get(`${fenceUri}user/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  /** @namespace data.project_access*/
  const data = response.data;
  return { ...data, projects: data.project_access }; //Backward compatibility.
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
    accessToken = await fetchTokenThenRefreshIfNeeded(api, fence);
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
  }).then((res) => res.json());
  if (!url) {
    return null;
  }
  return url;
};

/*
 * Get list of authorized studies for a user
 */
const toStudyId = (consentCode) => consentCode.split('.')[0];
export const getStudyIds = (fenceUser) => uniq(Object.keys(fenceUser.projects).map(toStudyId));
