import { hydrateResults, IQueryResults } from 'graphql/models';
import { QueryVariable } from 'graphql/queries';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IParticipantEntity, IParticipantResultTree } from './models';
import { SEARCH_PARTICIPANT_QUERY } from './queries';

export const useParticipants = (variables?: QueryVariable): IQueryResults<IParticipantEntity[]> => {
  const { loading, result } = useLazyResultQuery<IParticipantResultTree>(SEARCH_PARTICIPANT_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.participant?.hits?.edges || []),
    total: result?.participant?.hits?.total || 0,
  };
};
