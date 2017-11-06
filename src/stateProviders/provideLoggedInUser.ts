import { provideState } from 'freactal';
import { setToken } from 'services/ajax';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
  }),
  effects: {
    setUser: (effects, user) => state => ({ ...state, loggedInUser: user }),
    setToken: (effects, token) => state => {
      setToken(token);
      return { ...state, loggedInUserToken: token };
    },
  },
});
