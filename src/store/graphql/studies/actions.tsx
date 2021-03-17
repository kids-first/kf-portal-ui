import { INDEX_EXTENDED_MAPPING, STUDIES_QUERY } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';

export const useGetStudiesPageData = (variables: any) => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_QUERY, {
    variables: variables,
  });

  return {
    loading,
    results: result?.study,
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
