import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { INDEX_EXTENDED_MAPPING } from 'graphql/queries';

import { useLazyResultQueryOnLoadOnly } from 'hooks/graphql/useLazyResultQuery';

const useGetExtendedMappings = (index: string): IExtendedMappingResults => {
  // An index mapping only changes when Arranger is redeployed, so it is safe to
  // serve from the cache: one network call per index for the whole session
  // instead of one per mounted view.
  const { loading, result } = useLazyResultQueryOnLoadOnly<any>(INDEX_EXTENDED_MAPPING(index), {
    fetchPolicy: 'cache-first',
  });

  return {
    loading,
    data: (result && result[index]?.extended) || [],
  };
};

export default useGetExtendedMappings;
