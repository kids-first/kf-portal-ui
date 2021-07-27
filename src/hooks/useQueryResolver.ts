import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { print } from 'graphql/language/printer';
import urlJoin from 'url-join';

import { arrangerApiRoot, arrangerProjectId } from 'common/injectGlobals';
import { addToCache } from 'store/actionCreators/queryResolver';
import { RootState } from 'store/rootState';
import { selectCache } from 'store/selectors/queryResolver';

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
  const cache = useSelector((state: RootState) => selectCache(state));
  const dispatch = useDispatch();

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
        dispatch(
          addToCache({
            body: body,
            result: data,
          }),
        );
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
    }).then((data: any) =>
      data.map((d: any, i: any) => {
        const transform = queryList[i].transform;
        return transform ? transform(d) : d;
      }),
    );

    return result;
  };

  const cachedFetchData = (body: any) => cache[body] || fetchData(body);

  return { ...payload, updateQueries: setQueryList };
};

export default useQueryResolver;
