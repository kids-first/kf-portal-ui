import { provideState } from 'freactal';
import { setToken } from 'services/ajax';

const NUM_FIELDS = 8; //todo calc this in persona
export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
    percentageFilled: 0,
  }),
  effects: {
    setUser: (effects, user) => state => {
      console.log(user);
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
      return { ...state, loggedInUserToken: token };
    },
  },
});
