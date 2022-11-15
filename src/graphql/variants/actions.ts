import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IVariantEntity, IVariantResultTree } from './models';
import { SEARCH_VARIANT_QUERY } from './queries';
import {
  IQueryVariable,
  IQueryResults,
  IQueryOperationsConfig,
} from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';

export const useVariant = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
): IQueryResults<IVariantEntity[]> => {
  const { loading, result } = useLazyResultQuery<IVariantResultTree>(SEARCH_VARIANT_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.variants?.hits?.edges || [], operations?.previous),
    total: result?.variants?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.variants?.hits?.edges || [], operations),
  };
};
