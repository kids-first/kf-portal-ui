import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    advancedFacetSqon: null,
  }),
  effects: {
    setAdvancedFacetSqon: (effects, sqon) => state => {
      return {
        ...state,
        advancedFacetSqon: sqon,
      };
    },
  },
});
