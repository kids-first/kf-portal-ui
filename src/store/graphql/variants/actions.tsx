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
              field: 'gene.symbol',
              value: geneSymbol,
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

export const useVariantTableData = (selectedSuggestion: SelectedSuggestion) => {
  const { loading, result } = useLazyResultQuery<any>(VARIANT_TABLE_QUERY, {
    variables: [
      {
        sqon: buildSqon(selectedSuggestion),
      },
    ],
  });
  return {
    loading,
    results: (result?.variant?.hits?.edges || []).map((edge: Edge) => ({ ...edge.node })),
  };
};
