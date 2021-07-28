import { useEffect, useState } from 'react';
import { print } from 'graphql/language/printer';
import urlJoin from 'url-join';

import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';

import useQueryResolverCache from './useQueryResolverCache';

type Payload = {
  data: Array<any>;
  error: any;
};

type Output = {
  isLoading: boolean;
  updateQueries: Function;
  data: Array<any>;
  error: any;
};

var loadingQueries: Array<string> = [];

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
  const [payload, setPayload] = useState<Payload>({
    data: [],
    error: null,
  });
  const [queryList, setQueryList] = useState(queries);
  const { cache, cacheQuery } = useQueryResolverCache();

  useEffect(() => {
    update();
  }, [queryList]);

  const setLoading = (body: string, isLoading: boolean, error: any = null, data: any = []) => {
    if (isLoading) {
      loadingQueries.push(body);
    } else {
      loadingQueries = loadingQueries.filter((val) => val !== body);
    }
    if (data.length || error) {
      setPayload({
        ...payload,
        error,
        data,
      });
    }
  };

  const isQueryLoading = (body: string) => loadingQueries.includes(body);

  const update = async () => {
    if (queryList.length) {
      const body = JSON.stringify(
        queryList.map((q: any) => ({
          query: typeof q.query === 'string' ? q.query : print(q.query),
          variables: q.variables,
        })),
      );

      try {
        if (!isQueryLoading(body)) {
          setLoading(body, true);
          const data = useCache ? await cachedFetchData(body) : await fetchData(body);
          setLoading(body, false, null, data);
        }
      } catch (err) {
        setLoading(body, false, err);
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

  return {
    data: payload.data,
    error: payload.error,
    isLoading: loadingQueries.length > 0,
    updateQueries: setQueryList,
  };
};

export default useQueryResolver;
