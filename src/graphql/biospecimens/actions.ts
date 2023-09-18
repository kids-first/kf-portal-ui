import {
  IQueryOperationsConfig,
  IQueryResults,
  IQueryVariable,
} from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { INDEXES } from 'graphql/constants';
import { IUseParticipantEntityProps } from 'graphql/participants/models';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IBiospecimenEntity, IBiospecimenResultTree } from './models';
import {
  GET_BIOSPECIMEN_COUNT,
  GET_PARTICIPANT_BIOSPECIMENS,
  SEARCH_BIOSPECIMEN_QUERY,
} from './queries';

export const useBiospecimen = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
): IQueryResults<IBiospecimenEntity[]> => {
  const { loading, result } = useLazyResultQuery<IBiospecimenResultTree>(SEARCH_BIOSPECIMEN_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.biospecimen?.hits?.edges || [], operations?.previous),
    total: result?.biospecimen?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.biospecimen?.hits?.edges || [], operations),
  };
};

export const useTotalBiospecimens = (variables?: IQueryVariable): number => {
  const { result } = useLazyResultQuery<IBiospecimenResultTree>(GET_BIOSPECIMEN_COUNT, {
    variables,
  });

  return result?.biospecimen?.hits?.total || 0;
};

export const useBiospecimenParticipant = ({
  field,
  values,
}: IUseParticipantEntityProps): IQueryResults<IBiospecimenEntity[]> => {
  const sqon = {
    content: [{ content: { field, value: values, index: INDEXES.BIOSPECIMEN }, op: 'in' }],
    op: 'and',
  };
  const { loading, result } = useLazyResultQuery<IBiospecimenResultTree>(
    GET_PARTICIPANT_BIOSPECIMENS,
    {
      variables: { sqon },
    },
  );

  return {
    loading,
    data: hydrateResults(result?.biospecimen?.hits?.edges || []),
    total: result?.biospecimen?.hits?.total || 0,
  };
};
