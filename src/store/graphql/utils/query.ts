import {
  ApolloError,
  DocumentNode,
  gql,
  OperationVariables,
  QueryHookOptions,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client';

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

export const buildVariantSqon = (field: string, value: string) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field,
        value,
      },
    },
  ],
});

export const INDEX_EXTENDED_MAPPING = (index: string) => gql`
  query ExtendedMapping {
    ${index} {
      extended
    }
  }
`;
