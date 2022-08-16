import { hydrateResults, IQueryResults } from 'graphql/models';
import { QueryVariable } from 'graphql/queries';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IVariantEntity, IVariantResultTree } from './models';
import { SEARCH_VARIANT_QUERY } from './queries';

export const useVariant = (variables?: QueryVariable): IQueryResults<IVariantEntity[]> => {
  const { loading, result } = useLazyResultQuery<IVariantResultTree>(SEARCH_VARIANT_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.variants?.hits?.edges || []),
    total: result?.variants?.hits?.total || 0,
  };
};
