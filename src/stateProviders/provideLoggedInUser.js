import { provideState, mergeIntoState } from 'freactal';
import { isArray, get } from 'lodash';

import { setToken } from 'services/ajax';
import { getAllFieldNamesPromise } from 'services/profiles';
import { googleAppId } from 'common/injectGlobals';
import { SERVICES } from 'common/constants';
import { handleJWT } from 'components/Login';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
    percentageFilled: 0,
    integrationTokens: {},
  }),
  effects: {
    initialize: effects => state => {
      const { setToken, setUser } = effects;

      // Get EGO JWT from local storage
      const jwt = localStorage.getItem('EGO_JWT');
      if (jwt) {
        try {
          const gapi = global.gapi;
          gapi.load('auth2', () => {
            gapi.auth2.init({
              client_id: googleAppId,
            });
          });
        } catch (e) {
          global.log(e);
        }
        handleJWT({ jwt, setToken, setUser });

        // Get all integration keys from local storage
        SERVICES.forEach(service => {
          const storedToken = localStorage.getItem(`integration_${service}`);
          if (storedToken) {
            state.integrationTokens[service] = storedToken;
          }
        });
      }
      return state;
    },
    setUser: (effects, user) =>
      getAllFieldNamesPromise()
        .then(({ data }) => get(data, 'data.__type.fields', []).length)
        .then(totalFields => state => {
          const filledFields = Object.values(user || {}).filter(v => v || (isArray(v) && v.length));
          return {
            ...state,
            loggedInUser: user,
            percentageFilled: filledFields.length / totalFields,
          };
        }),
    setToken: (effects, token) => state => {
      setToken(token);
      if (token) {
        localStorage.setItem('EGO_JWT', token);
      } else {
        localStorage.removeItem('EGO_JWT');
      }
      return { ...state, loggedInUserToken: token };
    },
    setIntegrationToken: (effects, service, token) => state => {
      if (SERVICES.includes(service)) {
        const tokenKey = `integration_${service}`;
        if (token) {
          localStorage.setItem(tokenKey, token);
          state.integrationTokens[service] = token;
        } else {
          localStorage.removeItem(tokenKey);
          delete state.integrationTokens[service];
        }
      }
      return state;
    },
    clearIntegrationTokens: (effects) => state => {
      SERVICES.forEach(service =>
        localStorage.removeItem(`integration_${service}`)
      );
      state.integrationTokens = {};
    }
  },
});
