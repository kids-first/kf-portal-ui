import { IQueryOperationsConfig, IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { INDEXES } from 'graphql/constants';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IFileEntity, IFileResultTree } from './models';
import { GET_FILE_COUNT, GET_FILE_ENTITY, SEARCH_FILES_QUERY } from './queries';

export const useDataFiles = (variables?: IQueryVariable, operations?: IQueryOperationsConfig) => {
  const { loading, result } = useLazyResultQuery<IFileResultTree>(SEARCH_FILES_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.file?.hits?.edges || [], operations?.previous),
    total: result?.file?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.file?.hits?.edges || [], operations),
  };
};

export const useTotalDataFiles = (variables?: IQueryVariable): number => {
  const { result } = useLazyResultQuery<IFileResultTree>(GET_FILE_COUNT, {
    variables,
  });

  return result?.file?.hits?.total || 0;
};

interface IUseFileProps {
  field: string;
  value: string;
}

interface IUseFileReturn {
  loading: boolean;
  file?: IFileEntity;
}

export const useFileEntity = ({ field, value }: IUseFileProps): IUseFileReturn => {
  const sqon = {
    content: [{ content: { field, value, index: INDEXES.FILES }, op: 'in' }],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IFileResultTree>(GET_FILE_ENTITY, {
    variables: { sqon },
  });

  const file = result?.file?.hits?.edges[0]?.node || undefined;

  return {
    loading,
    file,
  };
};
