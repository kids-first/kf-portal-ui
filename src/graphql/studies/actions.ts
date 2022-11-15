import { IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IStudiesResultTree } from './models';
import { SEARCH_STUDIES_QUERY } from './queries';

export const useStudies = (variables?: IQueryVariable) => {
  const { loading, result } = useLazyResultQuery<IStudiesResultTree>(SEARCH_STUDIES_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.studies?.hits?.edges || []),
    total: result?.studies?.hits?.total || 0,
  };
};
