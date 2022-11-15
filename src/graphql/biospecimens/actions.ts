import { IQueryResults, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IBiospecimenEntity, IBiospecimenResultTree } from './models';
import { SEARCH_BIOSPECIMEN_QUERY } from './queries';

export const useBiospecimen = (variables?: IQueryVariable): IQueryResults<IBiospecimenEntity[]> => {
  const { loading, result } = useLazyResultQuery<IBiospecimenResultTree>(SEARCH_BIOSPECIMEN_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.biospecimen?.hits?.edges || []),
    total: result?.biospecimen?.hits?.total || 0,
  };
};
