import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';

import { DataCategory, StudiesResult } from 'store/graphql/studies/models';
import { useLazyResultQuery } from 'store/graphql/utils/query';

import { INDEX_EXTENDED_MAPPING, STUDIES_QUERY, STUDIES_SEARCH_QUERY } from './queries';

type AggregationBuckets = {
  buckets: [
    {
      key: string;
      doc_count: number;
    },
  ];
};

type AggregationResults = {
  domain: AggregationBuckets;
  experimental_strategy: AggregationBuckets;
  family_data: AggregationBuckets;
  program: AggregationBuckets;
};

type HitsResults = {
  edges: [
    {
      node: StudiesResult;
    },
  ];
  total: number;
};

export type HitsResultsDataCategory = {
  hits: {
    edges: [
      {
        node: DataCategory;
      },
    ];
  };
};

type StudiesPageData = {
  aggregations: AggregationResults;
  hits: HitsResults;
};

type ExtendedMapping = {
  displayName: string;
  field: string;
  isArray: boolean;
  type: string;
};

export type StudiesResults = {
  data: StudiesPageData | null;
  loading: boolean;
};

export type StudiesMappingResults = {
  loadingMapping: boolean;
  extendedMapping: ExtendedMapping[];
};

export type SidebarData = {
  studiesResults: StudiesResults;
  studiesMappingResults: StudiesMappingResults;
};

export type StudiesPageContainerData = {
  studiesResults: StudiesResults;
  studiesMappingResults: StudiesMappingResults;
  filters: ISqonGroupFilter;
};

export type SideBarData = {
  studiesMappingResults: StudiesMappingResults;
};

export type QueryVariable = {
  sqon: any;
  first: number; // number of element to fetch
  offset: number; // start from offset number of elements
};

export const useGetStudiesPageData = (variables: QueryVariable): StudiesResults => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_QUERY, {
    variables: variables,
  });

  return {
    loading,
    data: result?.studies || null,
  };
};

export const useGetStudiesSearch = (variables: QueryVariable): StudiesResults => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_SEARCH_QUERY, {
    variables: variables,
  });

  return {
    loading,
    data: result?.studies || null,
  };
};

export const useGetExtendedMappings = (index: string): StudiesMappingResults => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING(index), {
    variables: [],
  });

  return {
    loadingMapping: loading,
    extendedMapping: result?.studies.extended,
  };
};
