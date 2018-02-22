import { provideState } from 'freactal';
import { setToken } from 'services/ajax';

import { googleAppId } from 'common/injectGlobals';
import { handleJWT } from 'components/Login';

const NUM_FIELDS = 8; //todo calc this in persona
export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
    percentageFilled: 0,
  }),
  effects: {
    initialize: effects => state => {
      const { setToken, setUser } = effects;
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
  },
});
