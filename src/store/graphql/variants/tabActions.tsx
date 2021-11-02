import { buildVariantIdSqon, useLazyResultQuery } from '../utils/query';

import { StudyNode } from './models';
import { TAB_CLINICAL_QUERY, TAB_FREQUENCIES_QUERY, TAB_SUMMARY_QUERY } from './queries';

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
      variantStudies:
        nodeVariant?.studies?.hits?.edges.map((e: StudyNode) => ({
          ...e.node,
          participantTotalNumber: nodeVariant?.participant_total_number || 0,
        })) || [],
      participantTotalNumber: nodeVariant?.participant_total_number || 0,
      participantNumber: nodeVariant?.participant_number || 0,
      participant_ids: nodeVariant?.participant_ids || [],
      globalStudies: nodesStudies?.map((n: StudyNode) => n.node),
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
