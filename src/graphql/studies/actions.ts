import { IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IStudyResultTree } from './models';
import { SEARCH_STUDIES_QUERY } from './queries';

export const useStudies = (variables?: IQueryVariable) => {
  const { loading, result } = useLazyResultQuery<IStudyResultTree>(SEARCH_STUDIES_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.study?.hits?.edges || []),
    total: result?.study?.hits?.total || 0,
  };
};
