import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client';
import { IBaseQueryResults } from 'hooks/graphql/type';
import { useEffect, useState } from 'react';

const useLazyResultQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): IBaseQueryResults<TData> => {
  const { data, error, loading, previousData } = useQuery<TData, TVariables>(query, options);

  const result = data ?? previousData;
  return { error, loading, result };
};

/**
 * This hook will perform the query only on component load.
 * This can be usefull for example when working with antd/tabs
 *
 * see example here: /views/screens/variant/Entity/index.tsx
 */
export const useLazyResultQueryOnLoadOnly = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
) => {
  const [customOptions, setCustomOptions] = useState<{
    skip?: boolean;
    dataToReturn?: TData;
  }>({});
  const { loading, result, error } = useLazyResultQuery(query, {
    ...options,
    skip: options?.skip || customOptions.skip,
  });

  useEffect(() => {
    if (result) {
      setCustomOptions({
        skip: true,
        dataToReturn: result,
      });
    }
  }, [result]);

  return {
    loading,
    result: options?.skip || customOptions?.skip ? customOptions.dataToReturn : result,
    error,
  };
};

export default useLazyResultQuery;
