import { useDispatch, useSelector } from 'react-redux';

import { addToCache, removeFromCache } from 'store/actionCreators/queryResolver';
import { QueryType } from 'store/QueryResolverTypes';
import { RootState } from 'store/rootState';
import { selectCache } from 'store/selectors/queryResolver';

type Output = {
  cache: {
    [index: string]: string;
  };
  cacheQuery: Function;
  unCacheQuery: Function;
};

const useQueryResolverCache = (): Output => {
  const cache = useSelector((state: RootState) => selectCache(state));
  const dispatch = useDispatch();

  const cacheQuery = (query: QueryType) => {
    dispatch(addToCache(query));
  };

  const unCacheQuery = (queryBody: string) => {
    dispatch(removeFromCache(queryBody));
  };

  return { cache, cacheQuery, unCacheQuery };
};

export default useQueryResolverCache;
