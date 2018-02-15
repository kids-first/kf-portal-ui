import { provideState } from 'freactal';

export default provideState({
  initialState: props => ({
    localSqon: props.sqon,
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
