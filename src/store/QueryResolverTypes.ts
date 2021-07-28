export enum QueryResolverActions {
  removeFromCache = 'QUERY_RESOLVER_REMOVE_FROM_CACHE',
  addToCache = 'QUERY_RESOLVER_ADD_TO_CACHE',
  clearCache = 'QUERY_RESOLVER_CLEAR_CACHE',
}

type RemoveFromCacheAction = {
  type: QueryResolverActions.removeFromCache;
  queryBody: any;
};

export type QueryType = {
  body: string;
  result: any;
};

type AddToCacheAction = {
  type: QueryResolverActions.addToCache;
  query: QueryType;
};

type ClearCacheAction = {
  type: QueryResolverActions.clearCache;
};

export type QueryResolverState = {
  cache: { [index: string]: any };
};

export type QueryResolverActionTypes = RemoveFromCacheAction | AddToCacheAction | ClearCacheAction;
