import { QueryResolverActions, QueryResolverActionTypes, QueryType } from '../QueryResolverTypes';

export const removeFromCache = (queryBody: string): QueryResolverActionTypes => ({
  type: QueryResolverActions.removeFromCache,
  queryBody,
});

export const addToCache = (query: QueryType): QueryResolverActionTypes => ({
  type: QueryResolverActions.addToCache,
  query,
});
