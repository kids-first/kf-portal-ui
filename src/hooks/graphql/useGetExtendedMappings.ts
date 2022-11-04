import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { INDEX_EXTENDED_MAPPING } from 'graphql/queries';
import { useLazyResultQueryOnLoadOnly } from 'hooks/graphql/useLazyResultQuery';

const useGetExtendedMappings = (index: string): IExtendedMappingResults => {
  const { loading, result } = useLazyResultQueryOnLoadOnly<any>(INDEX_EXTENDED_MAPPING(index), {
    fetchPolicy: 'no-cache',
  });

  return {
    loading,
    data: (result && result[index]?.extended) || [],
  };
};

export default useGetExtendedMappings;
