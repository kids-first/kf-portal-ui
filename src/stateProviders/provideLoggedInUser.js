import { provideState } from 'freactal';
import { isArray, get } from 'lodash';
import { addHeaders } from '@arranger/components';
import { setToken } from 'services/ajax';
import { updateProfile, getAllFieldNamesPromise } from 'services/profiles';
import { googleAppId } from 'common/injectGlobals';
import { SERVICES } from 'common/constants';
import { handleJWT } from 'components/Login';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    isLoadingUser: true,
    loggedInUserToken: '',
    percentageFilled: 0,
    integrationTokens: {},
  }),
  effects: {
    initialize: effects => state => {
      const { setToken, setUser } = effects;
      const jwt = localStorage.getItem('EGO_JWT');
      if (jwt) {
        addHeaders({ authorization: `Bearer ${jwt}` });

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
      return {
        ...state,
        isLoadingUser: !!jwt,
      };
    },
    setUser: (effects, user) =>
      getAllFieldNamesPromise()
        .then(({ data }) => get(data, 'data.__type.fields', []).length)
        .then(totalFields => state => {
          const filledFields = Object.values(user || {}).filter(v => v || (isArray(v) && v.length));
          return {
            ...state,
            isLoadingUser: false,
            loggedInUser: user,
            percentageFilled: filledFields.length / totalFields,
          };
        }),
    addUserSet: (effects, set) => state => {
      const { email, sets, ...rest } = state.loggedInUser;
      updateProfile({
        user: {
          ...rest,
          sets: [...(sets || []), set],
        },
      }).then(profile => effects.setUser({ ...profile, email }));
    },
    setToken: (effects, token) => state => {
      setToken(token);
      if (token) {
        localStorage.setItem('EGO_JWT', token);
        addHeaders({ authorization: `Bearer ${token}` });
      } else {
        localStorage.removeItem('EGO_JWT');
        addHeaders({ authorization: '' });
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
      return { ...state, integrationTokens: { ...state.integrationTokens } };
    },
    getIntegrationToken: (effects, service) => state => {
      if (SERVICES.includes(service)) {
        const tokenKey = `integration_${service}`;
        return tokenKey ? localStorage.getItem(tokenKey) : null;
      }
    },
    clearIntegrationTokens: effects => state => {
      SERVICES.forEach(service => localStorage.removeItem(`integration_${service}`));
      return { ...state, integrationTokens: {} };
    },
  },
});
