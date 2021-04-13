import { useLazyResultQuery } from '../utils/query';
import { VARIANT_STATS_QUERY } from './queries';

export const useStatVariants = () => {
  const { loading, result } = useLazyResultQuery<any>(VARIANT_STATS_QUERY, {
    variables: {},
  });

  const stats = result?.variantStats?.hits?.edges[0]?.node;

  return {
    loading,
    stats,
  };
};
