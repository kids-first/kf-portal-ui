import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    localSqon: null,
  }),
  effects: {
    setAdvancedFacetSqon: (effects, sqon) => state => {
      return {
        ...state,
        localSqon: sqon,
      };
    },
  },
});
