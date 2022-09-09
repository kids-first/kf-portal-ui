import { hydrateResults } from 'graphql/models';
import { QueryVariable } from 'graphql/queries';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IStudiesResultTree } from './models';
import { SEARCH_STUDIES_QUERY } from './queries';

export const useStudies = (variables?: QueryVariable) => {
  const { loading, result } = useLazyResultQuery<IStudiesResultTree>(SEARCH_STUDIES_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.studies?.hits?.edges || []),
    total: result?.studies?.hits?.total || 0,
  };
};
