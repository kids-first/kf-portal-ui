import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    sqon: null,
  }),
  effects: {
    setSqon: (effects, sqon) => state => {
      return {
        ...state,
        sqon: sqon,
      };
    },
  },
});
