import { SEARCH_VARIANT_TABLE_QUERY } from './queries';
import {
  buildVariantIdSqon,
  enhanceNodeWithIndexKey,
  useLazyResultQuery,
} from 'store/graphql/utils/query';
import { GenomicFeatureType, SelectedSuggestion, VariantEntity } from './models';

const buildSearchTableSqon = (selectedSuggestion: SelectedSuggestion) => {
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
    : buildVariantIdSqon(suggestionId);
};

const PAGE_SIZE = 10;

const computeOffSet = (pageNum: number) => PAGE_SIZE * (pageNum - 1);

export const useVariantSearchTableData = (
  selectedSuggestion: SelectedSuggestion,
  pageNum: number,
) => {
  const { loading, result } = useLazyResultQuery<any>(SEARCH_VARIANT_TABLE_QUERY, {
    variables: {
      sqon: buildSearchTableSqon(selectedSuggestion),
      pageSize: PAGE_SIZE,
      offset: computeOffSet(pageNum),
    },
  });

  const nodes = enhanceNodeWithIndexKey(result?.variants?.hits?.edges);

  // @ts-ignore
  const variants = nodes as VariantEntity[];

  const total = result?.variants?.hits?.total || 0;
  return {
    loading,
    results: {
      variants,
      total,
    },
  };
};
