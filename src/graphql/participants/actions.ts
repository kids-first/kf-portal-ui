import { DocumentNode } from '@apollo/client';
import {
  IQueryOperationsConfig,
  IQueryResults,
  IQueryVariable,
} from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { INDEXES } from 'graphql/constants';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import {
  IDataFile,
  IDataFileResultTree,
  IParticipantEntity,
  IParticipantResultTree,
} from './models';
import {
  GET_DATA_FILE_AGG,
  GET_PARTICIPANT_COUNT,
  GET_PARTICIPANT_ENTITY,
  SEARCH_PARTICIPANT_QUERY,
} from './queries';

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

interface IUseParticipantProps {
  field?: string;
  value?: string | string[];
  query?: DocumentNode;
}

export const useParticipantsFromField = ({
  field = 'participant_id',
  value,
  query = GET_PARTICIPANT_COUNT,
}: IUseParticipantProps): {
  loading: boolean;
  participants?: IParticipantEntity[];
  total: number;
} => {
  const sqon = {
    content: [{ content: { field, value, index: INDEXES.PARTICIPANT }, op: 'in' }],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IParticipantResultTree>(query, {
    variables: { sqon },
  });

  return {
    loading,
    participants: hydrateResults(result?.participant?.hits?.edges || []),
    total: result?.participant?.hits?.total || 0,
  };
};

export const useParticipantEntity = ({
  field = 'participant_id',
  value,
  query = GET_PARTICIPANT_ENTITY,
}: IUseParticipantProps): { loading: boolean; participants?: IParticipantEntity[] } => {
  const sqon = {
    content: [{ content: { field, value: [value].flat(), index: INDEXES.PARTICIPANT }, op: 'in' }],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IParticipantResultTree>(query, {
    variables: { sqon },
  });

  const participants = result?.participant?.hits?.edges?.map((x) => x.node) || undefined;

  return {
    loading,
    participants,
  };
};

export const useDataFileAgg = (
  query = GET_DATA_FILE_AGG,
): { loading: boolean; dataFileAgg?: IDataFile } => {
  const sqon = {
    content: [],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IDataFileResultTree>(query, {
    variables: { sqon },
  });

  const dataFileAgg = result?.file?.aggregations || undefined;

  return {
    loading,
    dataFileAgg,
  };
};
