import { provideState } from 'freactal';
import { setToken } from 'services/ajax';

import { googleAppId } from 'common/injectGlobals';
import { SERVICES } from 'common/constants';
import { handleJWT } from 'components/Login';

const NUM_FIELDS = 8; //todo calc this in persona
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
        // for (const service in SERVICES) {
        //   const storedToken = localStorage.getItem(`integration_${service}`);
        //   if (storedToken) {
        //     state.integrationTokens[service] = storedToken;
        //   }
        // }
      }
      return state;
    },
    setUser: (effects, user) => state => {
      return {
        ...state,
        loggedInUser: user,
        percentageFilled: user
          ? `${Object.values(user).filter(v => v && v.length).length / NUM_FIELDS * 100}%`
          : 0,
      };
    },
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
      if (SERVICES.hasOwnProperty(service)) {
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
      for (const service in SERVICES) {
        localStorage.removeItem(`integration_${service}`);
      }
      state.integrationTokens = {};
    }
  },
});
