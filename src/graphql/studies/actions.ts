import { hydrateResults } from 'graphql/models';
import { QueryVariable } from 'graphql/queries';
import { useLazyResultQueryOnLoadOnly } from 'hooks/graphql/useLazyResultQuery';
import { IStudyResultTree } from './models';
import { FETCH_STUDIES_QUERY } from './queries';

export const useStudies = (variables?: QueryVariable) => {
  const { loading, result } = useLazyResultQueryOnLoadOnly<IStudyResultTree>(FETCH_STUDIES_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.study?.hits?.edges || []),
    total: result?.study?.hits?.total || 0,
  };
};
