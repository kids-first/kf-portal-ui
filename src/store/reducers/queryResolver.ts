import {
  QueryResolverActions,
  QueryResolverActionTypes,
  QueryResolverState,
} from '../QueryResolverTypes';

const initialState: QueryResolverState = {
  cache: {},
};

export default (state = initialState, action: QueryResolverActionTypes): QueryResolverState => {
  switch (action.type) {
    case QueryResolverActions.removeFromCache: {
      if (action.queryBody in state.cache) {
        delete state.cache[action.queryBody];
      }
      return {
        ...state,
        cache: state.cache,
      };
    }
    case QueryResolverActions.addToCache: {
      return {
        ...state,
        cache: {
          ...state.cache,
          [action.query.body]: action.query.result,
        },
      };
    }
    case QueryResolverActions.clearCache: {
      return {
        ...state,
        cache: {},
      };
    }
    default:
      return state;
  }
};
