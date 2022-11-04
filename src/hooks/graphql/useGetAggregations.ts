import { DocumentNode, TypedDocumentNode } from '@apollo/client';
import { IGqlResults } from '@ferlab/ui/core/graphql/types';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

const useGetAggregations = (
  variables: any,
  query: DocumentNode | TypedDocumentNode,
  index: string,
): IGqlResults<any> => {
  const { loading, result } = useLazyResultQuery<any>(query, {
    variables,
    fetchPolicy: 'no-cache',
  });

  return {
    loading,
    aggregations: result && index in result ? result[index].aggregations : null,
    data: [],
    total: 0,
  };
};

export default useGetAggregations;
