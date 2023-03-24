import {
  IQueryOperationsConfig,
  IQueryResults,
  IQueryVariable,
} from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { INDEXES } from 'graphql/constants';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import {
  IParticipantEntity,
  IParticipantResultTree,
  IUseParticipantEntityProps,
  IUseParticipantEntityResults,
} from './models';
import { GET_PARTICIPANT_COUNT, GET_PARTICIPANT_ENTITY, SEARCH_PARTICIPANT_QUERY } from './queries';

export const useParticipants = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
): IQueryResults<IParticipantEntity[]> => {
  const { loading, result } = useLazyResultQuery<IParticipantResultTree>(SEARCH_PARTICIPANT_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.participant?.hits?.edges || [], operations?.previous),
    total: result?.participant?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.participant?.hits?.edges || [], operations),
  };
};

export const useTotalParticipants = (variables?: IQueryVariable): number => {
  const { result } = useLazyResultQuery<IParticipantResultTree>(GET_PARTICIPANT_COUNT, {
    variables,
  });

  return result?.participant?.hits?.total || 0;
};

export const useParticipantEntity = ({
  field,
  values,
}: IUseParticipantEntityProps): IUseParticipantEntityResults => {
  const sqon = {
    content: [{ content: { field, value: values, index: INDEXES.PARTICIPANT }, op: 'in' }],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IParticipantResultTree>(GET_PARTICIPANT_ENTITY, {
    variables: { sqon },
  });

  const data = result?.participant?.hits?.edges[0].node;

  return {
    loading,
    data,
  };
};
