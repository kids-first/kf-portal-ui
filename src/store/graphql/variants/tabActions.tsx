import { buildVariantIdSqon, useLazyResultQuery } from '../utils/query';
import { TAB_CLINICAL_QUERY, TAB_FREQUENCIES_QUERY, TAB_SUMMARY_QUERY } from './queries';
import { StudyNode } from './models';

const MAX_NUMBER_STUDIES = 2000;

export const useTabFrequenciesData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_FREQUENCIES_QUERY, {
    variables: {
      sqon: buildVariantIdSqon(variantId),
      studiesSize: MAX_NUMBER_STUDIES,
    },
  });

  const nodeVariant = result?.variants?.hits?.edges[0]?.node;
  const nodesStudies = result?.studies?.hits?.edges;

  return {
    loading,
    data: {
      frequencies: nodeVariant?.frequencies || {},
      locus: nodeVariant?.locus || '',
      studies: nodeVariant?.studies?.hits?.edges.map((e: StudyNode) => e.node) || [],
      participant_number: nodeVariant?.participant_number || 0,
      participant_ids: nodeVariant?.participant_ids || [],
      dataStudies: nodesStudies?.map((n: { node: any }) => n.node),
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
  return { loading, data: result?.variants?.hits?.edges[0]?.node, error };
};

export const useTabClinicalData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_CLINICAL_QUERY, {
    variables: {
      sqon: buildVariantIdSqon(variantId),
    },
  });
  return { loading, data: result?.variants?.hits?.edges[0]?.node || {}, error };
};
