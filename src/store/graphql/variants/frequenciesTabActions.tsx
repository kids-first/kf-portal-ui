import { enhanceNodeWithIndexKey, useLazyResultQuery } from '../utils/query';
import { TABLE_STUDIES_QUERY } from './queries';

export const useTableStudiesData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TABLE_STUDIES_QUERY, {
    variables: {
      sqon: {
        //variant
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'hash',
              value: variantId,
            },
          },
        ],
      },
    },
  });

  const node = result?.variants?.hits?.edges[0]?.node;

  return {
    loading,
    data: {
      frequencies: node?.frequencies || {},
      studies: enhanceNodeWithIndexKey(node?.studies?.hits?.edges),
    },
    error,
  };
};
