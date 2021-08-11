import { omit } from 'lodash';

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
      return {
        ...state,
        cache: omit(state.cache, action.queryBody),
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
