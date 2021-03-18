import { GENE_TABLE_QUERY, VARIANT_TABLE_QUERY } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { GenomicFeatureType, SelectedSuggestion } from 'store/genomicSuggesterTypes';

type Edge = {
  node: {
    [index: string]: any;
  };
};

const findQuery = (type: GenomicFeatureType) => {
  if (type === GenomicFeatureType.GENE) {
    return GENE_TABLE_QUERY;
  } else if (type === GenomicFeatureType.Variant) {
    return VARIANT_TABLE_QUERY;
  }
  return VARIANT_TABLE_QUERY;
};

const buildSqon = (selectedSuggestion: SelectedSuggestion) => {
  const { suggestionId, featureType } = selectedSuggestion;
  if (featureType === GenomicFeatureType.GENE) {
    return {
      op: 'and',
      content: [
        {
          op: 'in',
          content: {
            field: 'symbol',
            value: suggestionId,
          },
        },
      ],
    };
  } else if (featureType === GenomicFeatureType.Variant) {
    return {
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
  }
  return null;
};

export const useVariantTableData = (selectedSuggestion: SelectedSuggestion) => {
  const { featureType } = selectedSuggestion;
  const query = findQuery(featureType);
  const { loading, result } = useLazyResultQuery<any>(query, {
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
