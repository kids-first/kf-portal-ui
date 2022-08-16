import { DocumentNode, TypedDocumentNode } from '@apollo/client';
import { GqlResults } from 'graphql/models';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

const useGetAggregations = (
  variables: any,
  query: DocumentNode | TypedDocumentNode,
  index: string,
): GqlResults<any> => {
  const { loading, result } = useLazyResultQuery<any>(query, {
    variables,
  });

  return {
    loading,
    aggregations: result && index in result ? result[index].aggregations : null,
    data: [],
    total: 0,
  };
};

export default useGetAggregations;
