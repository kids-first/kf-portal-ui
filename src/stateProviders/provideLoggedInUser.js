import { addHeaders } from '@kfarranger/components/dist';
import { mergeIntoState, provideState } from 'freactal';
import jwtDecode from 'jwt-decode';
import get from 'lodash/get';

import { EGO_JWT_KEY, SERVICES } from 'common/constants';
import { INTEGRATION_PREFIX } from 'common/constants';
import ROUTES from 'common/routes';
import { handleJWT, isAdminToken, validateJWT } from 'components/Login/utils';
import { getUserGroups } from 'components/Login/utils';
import { setToken } from 'services/ajax';
import { trackUserSession } from 'services/analyticsTracking';
import { initializeApi } from 'services/api';
import { removeCookie, setCookie } from 'services/cookie';
import history from 'services/history';
import { refreshToken } from 'services/login';
import { getAllFieldNamesPromise, updateProfile } from 'services/profiles';
import { hasUserRole } from 'utils';

const setEgoTokenCookie = (token) => {
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
    integrationTokens: {},
    acceptedKfOptIn: false,
    acceptedNihOptIn: false,
    acceptedDatasetSubscriptionKfOptIn: false,
  }),
  effects: {
    initialize: (effects) => (state) => {
      const { setToken, setUser } = effects;
      const provider = localStorage.getItem('LOGIN_PROVIDER');
      const jwt = localStorage.getItem(EGO_JWT_KEY);
      if (jwt) {
        const api = initializeApi({
          onError: () => {
            history.push('/error');
          },
          onUnauthorized: () => {
            window.location.reload();
          },
        });

        const processJWT = (jwt) => {
          handleJWT({
            provider,
            jwt,
            setToken,
            setUser,
            api,
            onFinish: (user) => {
              const showJoin = !hasUserRole(user);
              const routeIsNotAvailableWhenLoggedIn = ['/join', '/orcid'].includes(
                window.location.pathname,
              );
              if (showJoin) {
                history.push(ROUTES.join);
              } else if (!user.acceptedTerms) {
                history.push(ROUTES.termsConditions);
              } else if (routeIsNotAvailableWhenLoggedIn) {
                history.push(ROUTES.dashboard);
              }
            },
          });

          // Get all integration keys from local storage
          SERVICES.forEach((service) => {
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
            .then((response) => {
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
            .catch(() => effects.loggOut());
        }
        return { ...state, isLoadingUser: true };
      } else {
        return { ...state, isLoadingUser: false };
      }
    },
    loggOut: (effects) => () => {
      const newState = effects.clearIntegrationTokens();
      newState.loggedInUser = null;
      return mergeIntoState({
        ...newState,
        ...effects.setToken(),
        isLoadingUser: false,
      });
    },
    setUser: (effects, { api, isJoining = false, ...user }) =>
      getAllFieldNamesPromise(api)
        .then(({ data }) =>
          get(data, '__type.fields', [])
            .filter((field) => field && field.name !== 'sets')
            .map((field) => field.name),
        )
        .then(() => (state) => {
          const userGroups = state.loggedInUserToken
            ? getUserGroups({ validatedPayload: jwtDecode(state.loggedInUserToken) })
            : [];

          trackUserSession(user);
          return {
            ...state,
            isLoadingUser: false,
            loggedInUser: user,
            isAdmin: state.loggedInUserToken
              ? isAdminToken({ validatedPayload: jwtDecode(state.loggedInUserToken) })
              : false,
            userGroups,
            isJoining,
            egoGroups: userGroups,
          };
        })
        .catch((err) => console.error(err)),
    addUserSet: (effects, { api, ...set }) => (state) => {
      const {
        loggedInUser: { email, sets, ...rest },
      } = state;
      updateProfile(api)({
        user: {
          ...rest,
          sets: [...(sets || []), set],
        },
      }).then((profile) => effects.setUser({ ...profile, email, api }));
    },
    setToken: (effects, { token, provider } = {}) => (state) => {
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
    setIntegrationToken: (effects, service, token) => (state) => {
      if (SERVICES.includes(service)) {
        const tokenKey = `${INTEGRATION_PREFIX}${service}`;
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
    getIntegrationToken: (effects, service) => () => {
      if (SERVICES.includes(service)) {
        const tokenKey = `${INTEGRATION_PREFIX}${service}`;
        return tokenKey ? localStorage.getItem(tokenKey) : null;
      }
    },
    clearIntegrationTokens: () => (state) => {
      SERVICES.forEach((service) => localStorage.removeItem(`${INTEGRATION_PREFIX}${service}`));
      return { ...state, integrationTokens: {} };
    },
    setIsLoadingUser: (isLoading) => (state) => ({ ...state, isLoadingUser: isLoading }),
  },
});
