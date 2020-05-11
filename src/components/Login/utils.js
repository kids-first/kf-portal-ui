import get from 'lodash/get';
import isArrayLikeObject from 'lodash/isArrayLikeObject';
import toLower from 'lodash/toLower';
import jwtDecode from 'jwt-decode';

import { getProfile, createProfile } from 'services/profiles';
import { getUser as getCavaticaUser } from 'services/cavatica';
import { getAccessToken } from 'services/fence';
import { createExampleQueries } from 'services/riffQueries';
import { FENCES, CAVATICA } from 'common/constants';
import { store } from 'store';
import { loginSuccess, loginFailure } from 'store/actionCreators/user';

const initProfile = async (api, user, egoId) => {
  const profileCreation = createProfile(api)({ ...user, egoId });
  const sampleQueryCreation = createExampleQueries(api, egoId);
  const [x] = await Promise.all([profileCreation, sampleQueryCreation]);
  return x;
};

export const isAdminToken = ({ validatedPayload }) => {
  if (!validatedPayload) return false;
  const jwtUser = get(validatedPayload, 'context.user', {});
  const roles = jwtUser.roles;
  const type = jwtUser.type;
  // maintain backward compatibility
  return roles && null !== roles && isArrayLikeObject(roles)
    ? roles.includes('ADMIN')
    : type && type !== null && type === 'ADMIN';
};

export const getUserGroups = ({ validatedPayload }) => {
  if (!validatedPayload) return [];
  const jwtUser = get(validatedPayload, 'context.user', {});
  const groups = jwtUser.groups;
  return groups ? groups : [];
};

export const validateJWT = ({ jwt }) => {
  if (!jwt) return false;
  const validatedPayload = jwtDecode(jwt);
  const isCurrent = new Date(validatedPayload.exp * 1000).valueOf() > Date.now();
  const status = get(validatedPayload, 'context.user.status', '');
  const isApproved =
    isAdminToken({ validatedPayload }) || [status].map(toLower).includes('approved');
  return isCurrent && isApproved && validatedPayload;
};

export const handleJWT = async ({ provider, jwt, onFinish, setToken, setUser, api }) => {
  const jwtData = validateJWT({ jwt });

  if (!jwtData) {
    setToken();
    // clear the user details in the redux store
    store.dispatch(loginFailure());
  } else {
    try {
      await setToken({ token: jwt, provider });
      const user = jwtData.context.user;
      const egoId = jwtData.sub;
      const existingProfile = await getProfile(api)();
      const newProfile = !existingProfile ? await initProfile(api, user, egoId) : {};
      const loggedInUser = {
        ...(existingProfile || newProfile),
        email: user.email,
        egoGroups: user.groups,
      };
      await setUser({ ...loggedInUser, api });
      onFinish && onFinish(loggedInUser);

      // store the user details in the redux store
      store.dispatch(loginSuccess(loggedInUser));
    } catch (err) {
      console.error('Error during login', err);
      // clear the user details in the redux store
      store.dispatch(loginFailure());
    }
  }
  return jwtData;
};

/**
 * fetchIntegrationTokens
 * For all SERVICES listed in common/constants, call the key-store to retrieve any keys stored
 *  for the user.
 * Each call to key-store is resolved separately and asynchronously. Their value will be added
 *  to state once returned.
 */
export const fetchIntegrationTokens = ({ setIntegrationToken, api }) => {
  getCavaticaUser()
    .then((userData) => {
      setIntegrationToken(CAVATICA, JSON.stringify(userData));
    })
    .catch((error) => {
      console.error(error);
      // Could not retrieve cavatica user info, nothing to do.
    });

  // Get Gen3 Secret here
  FENCES.forEach((fence) => {
    getAccessToken(api, fence)
      .then((key) => {
        setIntegrationToken(fence, key);
      })
      .catch((res) => {
        console.error('Error getting Gen3 API Key');
        console.error(res);
      });
  });
};
