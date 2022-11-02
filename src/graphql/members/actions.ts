import { BooleanOperators, TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { IQueryResults, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';
import { IMemberEntity, IMemberEntityProfile, IMemberResultTree } from './models';
import { SEARCH_MEMBERS_QUERY } from './queries';

export const useMembers = (variables?: IQueryVariable): IQueryResults<IMemberEntity[]> => {
  const { loading, result } = useLazyResultQuery<IMemberResultTree>(SEARCH_MEMBERS_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.members?.hits?.edges || []),
    total: result?.members?.hits?.total || 0,
  };
};

export const useMemberProfile = (id: string): IMemberEntityProfile => {
  const { loading, result } = useLazyResultQuery<IMemberResultTree>(SEARCH_MEMBERS_QUERY, {
    variables: {
      first: 1,
      offset: 0,
      sqon: {
        content: [
          generateValueFilter({
            field: '_id',
            value: [id],
            operator: TermOperators.in,
          }),
        ],
        op: BooleanOperators.and,
      },
    },
  });

  return {
    loading,
    profile: hydrateResults(result?.members?.hits?.edges || [])[0],
    total: result?.members?.hits?.total || 0,
  };
};
