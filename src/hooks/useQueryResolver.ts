import { useEffect, useState } from 'react';
import { ASTNode } from 'graphql';
import { print } from 'graphql/language/printer';
import urlJoin from 'url-join';

import { arrangerApiProjectId, kfArrangerApiRoot } from 'common/injectGlobals';

import useQueryResolverCache from './useQueryResolverCache';

type Payload = {
  data: Array<any>;
  error: any;
};

type Output = Payload & {
  isLoading: boolean;
  updateQueries: Function;
};

type Query = {
  query: object | string;
  variables: object;
  transform: Function;
};

var loadingQueries: { [index: string]: Array<any> } = {};

const useQueryResolver = (
  api: Function,
  name: string = 'GQL_QUERIES_RESOLVER',
  queries: Array<Query> = [],
  useCache: boolean = true,
): Output => {
  const [payload, setPayload] = useState<Payload>({
    data: [],
    error: null,
  });
  const [queryList, setQueryList] = useState(queries);
  const { cache, cacheQuery } = useQueryResolverCache();

  useEffect(() => {
    if (!loadingQueries[name]) {
      loadingQueries[name] = [];
    }
    update();
  }, [queryList]);

  const setLoading = (body: string, isLoading: boolean, error: any = null, data: any = []) => {
    if (isLoading) {
      loadingQueries[name].push(body);
    } else {
      loadingQueries[name] = loadingQueries[name].filter((val) => val !== body);
    }
    if (data.length || error) {
      setPayload({
        ...payload,
        error,
        data,
      });
    }
  };

  const isQueryLoading = (body: string) => loadingQueries[name].includes(body);

  const update = async () => {
    if (queryList.length) {
      const body = JSON.stringify(
        queryList.map((q: Query) => ({
          query: typeof q.query === 'string' ? q.query : print(q.query as ASTNode),
          variables: q.variables,
          projectId: arrangerApiProjectId,
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

  const fetchData = (body: string) =>
    api({
      method: 'POST',
      url: urlJoin(kfArrangerApiRoot!, `/search`),
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

  const cachedFetchData = (body: string) => cache[body] || fetchData(body);

  return {
    data: payload.data,
    error: payload.error,
    isLoading: loadingQueries[name]?.length > 0,
    updateQueries: setQueryList,
  };
};

export default useQueryResolver;
