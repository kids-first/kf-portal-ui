import { buildVariantSqon, useLazyResultQuery } from '../utils/query';

import { StudyNode } from './models';
import { TAB_FREQUENCIES_QUERY, TAB_SUMMARY_CLINICAL_QUERY } from './queries';

const MAX_NUMBER_STUDIES = 2000;

export const useTabFrequenciesData = (field: string, value: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_FREQUENCIES_QUERY, {
    variables: {
      sqon: buildVariantSqon(field, value),
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

export const useTabSummaryClinicalData = (field: string, value: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_SUMMARY_CLINICAL_QUERY, {
    variables: {
      sqon: buildVariantSqon(field, value),
    },
  });
  return { loading, data: result?.variants?.hits?.edges[0]?.node, error };
};
