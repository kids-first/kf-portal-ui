export enum QueryResolverActions {
  removeFromCache = 'RemoveFromCache',
  addToCache = 'AddToCache',
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

export type QueryResolverState = {
  cache: { [index: string]: any };
};

export type QueryResolverActionTypes = RemoveFromCacheAction | AddToCacheAction;
