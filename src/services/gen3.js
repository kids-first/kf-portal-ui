import * as React from 'react';
import { gen3OauthRedirect, gen3IntegrationRoot } from 'common/injectGlobals';
import jwtDecode from 'jwt-decode';
import Component from 'react-component-component';
import { withApi } from 'services/api';
import { setUserDimension } from 'services/analyticsTracking';
import { uniq } from 'lodash';
import { compose } from 'recompose';
import { injectState } from 'freactal';
import { gen3ApiRoot } from 'common/injectGlobals';
import { EGO_JWT_KEY } from 'common/constants';

const AUTHORIZE_URL = `${gen3ApiRoot}user/oauth2/authorize`;
const CLIENT_URL = `${`${gen3IntegrationRoot}/auth-client`}`;
const TOKEN_URL = `${`${gen3IntegrationRoot}/token`}`;
const REFRESH_URL = `${`${gen3IntegrationRoot}/refresh`}`;
const REDIRECT_URI = gen3OauthRedirect;
const RESPONSE_TYPE = 'code';

// This component gets rendered on a new window just to write token to key manager. No need to render anything
export const Gen3AuthRedirect = compose(withApi, injectState)(({ api, state }) => (
  <Component
    didMount={() => {
      const code = new URLSearchParams(window.location.search).get('code');
      const egoJwt = localStorage.getItem(EGO_JWT_KEY);
      if (code && egoJwt) {
        api({
          url: `${TOKEN_URL}/?code=${code}`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${egoJwt}`,
          },
        })
          .then(result => {
            window.close();
          })
          .catch(err => {
            window.alert('Something went wrong, please refresh your window and try again.');
            window.close();
          });
      } else {
        window.close();
      }
    }}
  />
));

// window.open has to happen in the same synchronus callstack as the event handler,
// so client secrets must be available at all times.
const state = {};
fetch(CLIENT_URL)
  .then(res => res.json())
  .then(({ client_id }) => {
    state.client_id = client_id;
    state.scope = `openid+data+user`;
  });

export const connectGen3 = api => {
  const { client_id, scope } = state;
  const url = `${AUTHORIZE_URL}?client_id=${client_id}&response_type=${RESPONSE_TYPE}&scope=${scope}&redirect_uri=${REDIRECT_URI}`;
  const authWindow = window.open(url);
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (authWindow.closed) {
        getAccessToken(api)
          .then(access_token => {
            if (access_token) {
              clearInterval(interval);
              resolve(access_token);
            }
          })
          .catch(err => {
            clearInterval(interval);
            reject({ msg: 'AUTH_FAILED' });
          });
      }
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      reject('nothing');
    }, 1000 * 60 * 10);
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
  // track how many projects a use has access to
  // dimensionr in GA is "authorizedStudies"
  setUserDimension('dimension5', user.projects);
  return user;
};

export const deleteGen3Token = async api => {
  // reset authorized studies tracking
  setUserDimension('dimension5', 'none');
  await api({
    method: 'DELETE',
    url: TOKEN_URL,
  });
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

const toStudyId = consentCode => consentCode.split('.')[0];
export const getStudyIds = gen3User => uniq(Object.keys(gen3User.projects).map(toStudyId));

export const Gen3UserProvider = withApi(({ render, api }) => (
  <Component
    initialState={{ gen3User: null, loading: true }}
    didMount={({ setState }) =>
      getUser(api)
        .then(user => setState({ gen3User: user, loading: false }))
        .catch(err => setState({ loading: false }))
    }
  >
    {({ state: { gen3User, loading } }) => render({ gen3User, loading })}
  </Component>
));
