import { INDEX_EXTENDED_MAPPING, STUDIES_QUERY } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { StudiesResult } from 'store/graphql/studies/models';
import { ISqonGroupFilter } from '@ferlab/ui/core/components/QueryBuilder/types';

type AggregationBuckets = {
  buckets: [
    {
      key: string;
      doc_count: number;
    },
  ];
};

type AggregationResults = {
  available_data_types: AggregationBuckets;
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
};

type StudiesPageData = {
  aggregations: AggregationResults;
  hits: HitsResults;
};

export type StudiesResults = {
  data: StudiesPageData;
  loading: boolean;
};

export type StudiesMappingResults = {
  loadingMapping: boolean;
  extendedMapping: any; //FIXME
};

export type SidebarData = {
  studiesResults: StudiesResults;
  studiesMappingResults: StudiesMappingResults;
};

export type StudiesPageContainerData = {
  studiesResults: StudiesResults;
  filters: ISqonGroupFilter;
};

export type SideBarData = {
  studiesMappingResults: StudiesMappingResults;
};

export const useGetStudiesPageData = (variables: any): StudiesResults => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_QUERY, {
    variables: variables,
  });

  return {
    loading,
    data: result?.study,
  };
};

export const useGetExtendedMappings = (index: string): StudiesMappingResults => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING(index), {
    variables: [],
  });

  return {
    loadingMapping: loading,
    extendedMapping: result?.study.extended,
  };
};
