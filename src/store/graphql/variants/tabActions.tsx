import { buildVariantIdSqon, enhanceNodeWithIndexKey, useLazyResultQuery } from '../utils/query';
import { TAB_FREQUENCIES_QUERY, TAB_SUMMARY_QUERY, TAB_CLINICAL_QUERY } from './queries';

export const useTabFrequenciesData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_FREQUENCIES_QUERY, {
    variables: {
      sqon: buildVariantIdSqon(variantId),
    },
  });

  const node = result?.variants?.hits?.edges[0]?.node;
  const combinedExternalFrequencies = node?.frequencies?.internal?.combined || {};

  return {
    loading,
    data: {
      combinedExternalFrequencies,
      studies: enhanceNodeWithIndexKey(node?.studies?.hits?.edges),
    },
    error,
  };
};

export const useTabSummaryData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_SUMMARY_QUERY, {
    variables: {
      sqon: buildVariantIdSqon(variantId),
    },
  });
  return { loading, data: result, error };
};

export const useTabClinicalData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_CLINICAL_QUERY, {
    variables: {
      sqon: buildVariantIdSqon(variantId),
    },
  });
  return { loading, data: result, error };
};
