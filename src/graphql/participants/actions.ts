import { IQueryResults, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IParticipantEntity, IParticipantResultTree } from './models';
import { SEARCH_PARTICIPANT_QUERY } from './queries';

export const useParticipants = (
  variables?: IQueryVariable,
): IQueryResults<IParticipantEntity[]> => {
  const { loading, result } = useLazyResultQuery<IParticipantResultTree>(SEARCH_PARTICIPANT_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.participant?.hits?.edges || []),
    total: result?.participant?.hits?.total || 0,
  };
};
