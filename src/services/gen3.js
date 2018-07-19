import { gen3ApiRoot } from 'common/injectGlobals';
import { gen3OauthRedirect, gen3IntegrationRoot } from 'common/injectGlobals';
import jwtDecode from 'jwt-decode';

const AUTHORIZE_URL = `${gen3ApiRoot}user/oauth2/authorize`;
const CLIENT_URL = `${`${gen3IntegrationRoot}/auth-client`}`;
const TOKEN_URL = `${`${gen3IntegrationRoot}/token`}`;
const REFRESH_URL = `${`${gen3IntegrationRoot}/refresh`}`;
const REDIRECT_URI = gen3OauthRedirect;
const RESPONSE_TYPE = 'code';

export const Gen3AuthRedirect = props => {
  const code = new URLSearchParams(window.location.search).get('code');
  if (code) {
    window.top.postMessage({ type: 'OAUTH_SUCCESS', payload: code }, `${window.location.origin}`);
  } else {
    window.top.postMessage({ type: 'OAUTH_FAIL', payload: code }, `${window.location.origin}`);
  }
  window.close();
  return null;
};

// window.open has to happen in the same synchronus callstack as the event handler,
// so client secrets must be available at all times.
const state = {};
fetch(CLIENT_URL)
  .then(res => res.json())
  .then(({ client_id, scope }) => {
    state.client_id = client_id;
    state.scope = `${scope}`;
  });

export const connectGen3 = api => {
  const { client_id, scope } = state;
  const url = `${AUTHORIZE_URL}?client_id=${client_id}&response_type=${RESPONSE_TYPE}&scope=${scope}&redirect_uri=${REDIRECT_URI}`;
  const authWindow = window.open(url);
  return new Promise((resolve, reject) => {
    const state = { done: false };
    const onAuthWindowMessage = e => {
      const { data } = e;
      switch (data.type) {
        case 'OAUTH_SUCCESS':
          clearInterval(interval);
          const code = data.payload;
          if (!state.done) {
            api({
              url: `${TOKEN_URL}/?code=${code}`,
              method: 'POST',
            }).then(resolve);
          }
          state.done = true;
          break;
        case `OAUTH_FAIL`:
          clearInterval(interval);
          state.done = true;
          reject(data);
          break;
        default:
          console.log('default: ', data);
      }
    };

    // The NIH's login screen enforces same origin, so this interval ensures that
    // the event handler is attached. It gets detached on every reload so an interval
    // is the safest way...
    const interval = setInterval(() => {
      try {
        if (!authWindow.closed) {
          authWindow.onmessage = onAuthWindowMessage;
        } else {
          if (authWindow.onmessage) {
            clearInterval(interval);
          } else {
            clearInterval(interval);
            reject({
              msg: 'PROCESS_INTERRUPTED',
            });
          }
        }
      } catch (err) {
        console.log('err: ', err);
      }
    }, 200);
  });
};

/** getUser()
  Return object structure:
  {
    "google": {
      "proxy_group": null
    },
    "is_admin": false,
    "name": "RBAJARI",
    "projects": {
      "phs001247": [
        "read-storage"
      ],
      "phs001110": [
        "read-storage"
      ],
    }
  }
*/
export const getUser = async api => {
  let accessToken = await getAccessToken(api);
  const { context: { user } } = jwtDecode(accessToken);
  return user;
};

/**
Should return access token
  "eyJhb6IkpXVCIsImtpZCI6ImtleS0wMSJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiaXNfYWRtaW4iOmZhbHNlLCJuYW1lIjoiUkFIVUxWRVJNQSIsInByb2plY3RzIjp7InBoczAwMTEzOCI6WyJyZWFkLXN0b3JhZ2UiXSwibWFyY2gtZGVtbyI6WyJyZWFkLXN0b3JhZ2UiXSwicGhzMDAxMjI4IjpbInJlYWQtc3RvcmFnZSJdfX19LCJqdGkiOiI5YTcxMzJlYi05YWJkLTQyOWQtYWJiNi1hZWEzNTQ4YTFkNzUiLCJhdWQiOlsiZGF0YSIsInVzZXIiLCJmZW5jZSIsIm9wZW5pZCJdLCJleHAiOjE1MjA1Mzg4NjQsImlzcyI6Imh0dHBzOi8vZ2VuM3FhLmtpZHMtZmlyc3QuaW8vdXNlciIsImlhdCI6MTUyMDUzNTI2NCwicHVyIjoiYWNjZXNzIiwic3ViIjoiNTgifQ.jYR_Ppm3wJ1nCgzegyb3UPQbAOFPmcXfGyUkneywcQE4B7BWJAh_N48BTmOY8-jMAF8HpberTd86IkOquYQki3T2LzXf4BgxhApUjeIke_MLD5SjkhY0gUVCbgbTPPRZDWV2ynBNivmOoHoVV15rS-Xp3b-hULTfsNERE8tmuNnAjEsb5iLahxsA3HVKRHCNyTAsWEW9nn82vmAd4F5p3y1zIvn5Ks0bb0Foigy3mN-d6T49iTzVb6BAmyxra8rGx8-Vo7LgRaNMZ6iYVzuDH1H8r3PM58PF4hFOn65IkZ4oro1YRZXIto9G9XvVjFlhw"
*/
// TODO: handle refresh token expiry case from lambda
const getRefreshedToken = async api =>
  api({
    method: 'POST',
    url: REFRESH_URL,
  })
    .then(data => {
      if (data.access_token) {
        return data;
      } else {
        return connectGen3(api);
      }
    })
    .then(({ access_token }) => access_token);

export const getAccessToken = async api => {
  const currentToken = await api({
    method: 'GET',
    url: `${TOKEN_URL}`,
  }).then(({ access_token }) => access_token);
  const { exp } = jwtDecode(currentToken);
  return exp * 1000 > Date.now() ? currentToken : await getRefreshedToken(api);
};

export const downloadFileFromGen3 = async ({ fileUUID, api }) => {
  let accessToken = await getAccessToken(api);
  const { url } = await fetch(gen3ApiRoot + 'user/data/download/' + fileUUID, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(res => res.json());
  if (!url) {
    return null;
  }
  return url;
};
