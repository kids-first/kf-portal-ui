import {
  ApolloError,
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client';
import { Edge, Edges } from 'store/esTypes';

export enum Hits {
  COLLECTION = 'hits.edges',
  SINGLE_ITEM = 'hits.edges[0].node',
  ITEM = 'hits',
}

export interface IBaseQueryResults<TData> {
  error: ApolloError | undefined;
  result: TData | undefined;
  loading: boolean;
}

export const useLazyResultQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): IBaseQueryResults<TData> => {
  const { data, error, loading, previousData } = useQuery<TData, TVariables>(query, options);

  let result = previousData;

  if (data) {
    result = data;
  }

  return { error, loading, result };
};

export const enhanceNodeWithIndexKey = (edges: Edges) =>
  (edges || []).map((edge: Edge, index: number) => ({
    ...edge.node,
    key: `${index + 1}`,
  }));

export const buildVariantIdSqon = (id: string) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'hash',
        value: id,
      },
    },
  ],
});
