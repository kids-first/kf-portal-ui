import { useEffect, useState } from 'react';
import { print } from 'graphql/language/printer';
import urlJoin from 'url-join';

import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';

import useQueryResolverCache from './useQueryResolverCache';

type Output = {
  isLoading: boolean;
  data: Array<any>;
  error: any;
  updateQueries: Function;
};

const useQueryResolver = (
  api: Function,
  name: string = 'GQL_QUERIES_RESOLVER',
  queries: Array<{
    query: object | string;
    variables: object;
    transform: Function;
  }> = [],
  useCache: boolean = true,
): Output => {
  const [payload, setPayload] = useState({
    isLoading: true,
    data: [],
    error: null,
  });
  const [queryList, setQueryList] = useState(queries);
  const { cache, cacheQuery } = useQueryResolverCache();

  useEffect(() => {
    update();
  }, [queryList]);

  const update = async () => {
    if (queryList.length) {
      const body = JSON.stringify(
        queryList.map((q: any) => ({
          query: typeof q.query === 'string' ? q.query : print(q.query),
          variables: q.variables,
        })),
      );

      try {
        const data = useCache ? await cachedFetchData(body) : await fetchData(body);
        setPayload({
          ...payload,
          isLoading: false,
          data: data,
        });
      } catch (err) {
        setPayload({
          ...payload,
          isLoading: false,
          error: err,
        });
      }
    }
  };

  const fetchData = (body: string) => {
    const result = api({
      method: 'POST',
      url: urlJoin(arrangerApiRoot!, `/${arrangerProjectId}/graphql/${name}`),
      body,
    }).then((data: any) => {
      const result = data.map((d: any, i: any) => {
        const transform = queryList[i].transform;
        return transform ? transform(d) : d;
      });
      cacheQuery({
        body,
        result,
      });
      return result;
    });

    return result;
  };

  const cachedFetchData = (body: any) => cache[body] || fetchData(body);

  return { ...payload, updateQueries: setQueryList };
};

export default useQueryResolver;
