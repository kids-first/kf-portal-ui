import { useLazyResultQuery } from 'store/graphql/utils/query';
import { VARIANT_QUERY } from './queries';
import { VariantEntityResults } from 'store/graphql/variants/models';

export const useGetVariantEntityPageData = (variables: any): VariantEntityResults => {
  const { loading, result } = useLazyResultQuery<any>(VARIANT_QUERY, {
    variables: variables,
  });

  return {
    loading,
    data: result?.variants || null,
  };
};
