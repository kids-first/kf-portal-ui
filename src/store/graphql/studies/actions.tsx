import { INDEX_EXTENDED_MAPPING, STUDIES_BUCKETS, STUDIES_QUERY } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { StudiesResult } from 'store/graphql/studies/models';

export const useGetStudiesPageData = () => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_QUERY, {
    variables: [],
  });

  return {
    loading,
    results: result?.study.hits.edges.map((edge: { node: StudiesResult }) => ({
      ...edge.node,
    })),
  };
};

export const useGetStudiesFilterBuckets = () => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_BUCKETS, {
    variables: [],
  });

  return {
    loading,
    results: result?.study.aggregations,
  };
};

export const useGetExtendedMappings = (index: string) => {
  const { loading, result } = useLazyResultQuery<any>(INDEX_EXTENDED_MAPPING(index), {
    variables: [],
  });

  return {
    loading,
    results: result?.study.extended,
  };
};
