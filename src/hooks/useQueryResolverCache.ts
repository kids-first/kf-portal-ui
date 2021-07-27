import { useSelector } from 'react-redux';

import { addToCache, removeFromCache } from 'store/actionCreators/queryResolver';
import { RootState } from 'store/rootState';
import { selectCache } from 'store/selectors/queryResolver';

type Output = {
  cache: {
    [index: string]: any;
  };
  addToCache: Function;
  removeFromCache: Function;
};

const useQueryResolverCache = (): Output => {
  const cache = useSelector((state: RootState) => selectCache(state));

  return { cache, addToCache, removeFromCache };
};

export default useQueryResolverCache;
