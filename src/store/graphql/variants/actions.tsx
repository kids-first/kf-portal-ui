import { VARIANT_TABLE_QUERY } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { Edge } from 'store/esTypes';
import { GenomicFeatureType, SelectedSuggestion } from './models';

const buildSqon = (selectedSuggestion: SelectedSuggestion) => {
  const { suggestionId, featureType, geneSymbol } = selectedSuggestion;
  const isGene = featureType === GenomicFeatureType.GENE;
  return isGene
    ? {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'genes.symbol',
              value: [geneSymbol],
            },
          },
        ],
      }
    : {
        //variant
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field: 'hash',
              value: suggestionId,
            },
          },
        ],
      };
};
const PAGE_SIZE = 10;

const computeOffSet = (pageNum: number) => PAGE_SIZE * (pageNum - 1);

export const useVariantTableData = (selectedSuggestion: SelectedSuggestion, pageNum: number) => {
  const { loading, result } = useLazyResultQuery<any>(VARIANT_TABLE_QUERY, {
    variables: {
      sqon: buildSqon(selectedSuggestion),
      pageSize: PAGE_SIZE,
      offset: computeOffSet(pageNum),
    },
  });

  const nodes = (result?.variants?.hits?.edges || []).map((edge: Edge, index: number) => ({
    ...edge.node,
    key: `${index + 1}`,
  }));

  const total = result?.variants?.hits?.total || 0;
  return {
    loading,
    results: {
      nodes,
      total,
    },
  };
};
