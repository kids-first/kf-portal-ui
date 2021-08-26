import { DocumentNode, TypedDocumentNode } from '@apollo/client';

import { useLazyResultQuery } from 'store/graphql/utils/query';

import { QueryVariable } from '../studies/actions';

import { INDEX_EXTENDED_MAPPING } from './query';

export type ExtendedMapping = {
  displayName: string;
  field: string;
  isArray: boolean;
  type: string;
};

export type MappingResults = {
  loadingMapping: boolean;
  extendedMapping: ExtendedMapping[];
};

export const useGetExtendedMappings = (index: string): MappingResults => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING(index), {
    variables: [],
  });

  return {
    loadingMapping: loading,
    extendedMapping: (result && result[index]?.extended) || null,
  };
};

export const useGetPageData = (
  variables: QueryVariable,
  query: DocumentNode | TypedDocumentNode,
  index: string,
) => {
  const { loading, result } = useLazyResultQuery<any>(query, {
    variables: variables,
  });

  return {
    loading,
    data: (result && result[index]) || null,
  };
};
