import { provideState, mergeIntoState } from 'freactal';
import isArray from 'lodash/isArray';
import pick from 'lodash/pick';
import without from 'lodash/without';
import omit from 'lodash/omit';
import get from 'lodash/get';
import jwtDecode from 'jwt-decode';
import { addHeaders } from '@kfarranger/components/dist';
import { setToken } from 'services/ajax';
import { updateProfile, getAllFieldNamesPromise } from 'services/profiles';
import { SERVICES, EGO_JWT_KEY } from 'common/constants';
import { setCookie, removeCookie } from 'services/cookie';
import { validateJWT, handleJWT, isAdminToken } from 'components/Login/utils';
import { refreshToken } from 'services/login';

import {
  TRACKING_EVENTS,
  trackUserSession,
  trackUserInteraction,
} from 'services/analyticsTracking';
import { initializeApi } from 'services/api';
import history from 'services/history';

const setEgoTokenCookie = token => {
  const { exp } = jwtDecode(token);
  const expires = new Date(exp * 1000);
  setCookie(EGO_JWT_KEY, token, {
    expires: expires,
  });
};

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loginProvider: null,
    isLoadingUser: true,
    loggedInUserToken: '',
    percentageFilled: 0,
    integrationTokens: {},
    acceptedKfOptIn: false,
    acceptedNihOptIn: false,
    acceptedDatasetSubscriptionKfOptIn: false,
  }),
  effects: {
    initialize: effects => state => {
      const { setToken, setUser } = effects;
      const provider = localStorage.getItem('LOGIN_PROVIDER');
      const jwt = localStorage.getItem(EGO_JWT_KEY);
      if (jwt) {
        const api = initializeApi({
          onError: err => {
            history.push('/error');
          },
          onUnauthorized: response => {
            window.location.reload();
          },
        });

        const processJWT = jwt => {
          handleJWT({
            provider,
            jwt,
            setToken,
            setUser,
            api,
            onFinish: user => {
              if (!user.roles || user.roles.length === 0 || !user.acceptedTerms) {
                history.push('/join');
              } else if (['/', '/join', '/orcid'].includes(window.location.pathname)) {
                history.push('/dashboard');
              }
            },
          });

          // Get all integration keys from local storage
          SERVICES.forEach(service => {
            const storedToken = localStorage.getItem(`integration_${service}`);
            if (storedToken) {
              state.integrationTokens[service] = storedToken;
            }
          });
          setEgoTokenCookie(jwt);
        };

        if (validateJWT({ jwt })) {
          processJWT(jwt);
        } else {
          // Token possibly out of date
          refreshToken(provider)
            .then(response => {
              if (response.type === 'redirect') {
                effects.clearIntegrationTokens();
                effects.setToken();
                return { ...state, isLoadingUser: true };
              }
              const refreshedJwt = response.data;
              if (validateJWT({ jwt: refreshedJwt })) {
                processJWT(refreshedJwt);
                return { ...state, isLoadingUser: false };
              }
            })
            .catch(e => {
              return effects.loggOut();
            });
        }
        return { ...state, isLoadingUser: true };
      } else {
        return { ...state, isLoadingUser: false };
      }
    },
    loggOut: effects => state => {
      const newState = effects.clearIntegrationTokens();
      newState.loggedInUser = null;
      return mergeIntoState({
        ...newState,
        ...effects.setToken(),
        isLoadingUser: false,
      });
    },
    setUser: (effects, { api, egoGroups, ...user }) => {
      return getAllFieldNamesPromise(api)
        .then(({ data }) => {
          return get(data, '__type.fields', [])
            .filter(field => field && field.name !== 'sets')
            .map(field => field.name);
        })
        .then(fields => state => {
          const userRole = user.roles ? user.roles[0] : null;
          const userRoleProfileFields =
            userRole && userRole !== 'research'
              ? without(fields, 'institution', 'jobTitle')
              : fields;
          const profile = pick(omit(user, 'sets'), userRoleProfileFields);
          const filledFields = Object.values(profile || {}).filter(
            v => (isArray(v) && v.length) || (!isArray(v) && v),
          );
          const percentageFilled = filledFields.length / userRoleProfileFields.length;
          if (state.loggedInUser && state.percentageFilled < 1 && percentageFilled >= 1) {
            trackUserInteraction({
              category: TRACKING_EVENTS.categories.user.profile,
              action: TRACKING_EVENTS.actions.completedProfile,
              label: user.roles[0],
            });
          }
          trackUserSession({ ...user, egoGroups });
          return {
            ...state,
            isLoadingUser: false,
            loggedInUser: user,
            isAdmin: state.loggedInUserToken
              ? isAdminToken({ validatedPayload: jwtDecode(state.loggedInUserToken) })
              : false,
            percentageFilled,
          };
        })
        .catch(err => console.log(err));
    },
    addUserSet: (effects, { api, ...set }) => state => {
      const {
        loggedInUser: { email, sets, ...rest },
      } = state;
      updateProfile(api)({
        user: {
          ...rest,
          sets: [...(sets || []), set],
        },
      }).then(profile => effects.setUser({ ...profile, email, api }));
    },
    setToken: (effects, { token, provider } = {}) => state => {
      setToken(token);
      if (token) {
        localStorage.setItem('LOGIN_PROVIDER', provider);
        localStorage.setItem(EGO_JWT_KEY, token);
        setEgoTokenCookie(token);
        addHeaders({ authorization: `Bearer ${token}` });
      } else {
        localStorage.removeItem('LOGIN_PROVIDER');
        localStorage.removeItem(EGO_JWT_KEY);
        removeCookie(EGO_JWT_KEY, token);
        addHeaders({ authorization: '' });
      }

      return { ...state, loggedInUserToken: token, loginProvider: provider };
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
