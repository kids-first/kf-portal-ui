import { buildVariantIdSqon, useLazyResultQuery } from '../utils/query';
import {
  TAB_CLINICAL_QUERY,
  TAB_FREQUENCIES_QUERY,
  TAB_FREQUENCIES_STUDY_ID_CODE,
  TAB_SUMMARY_QUERY,
} from './queries';
import { StudyInfoResults } from './models';

export const useTabFrequenciesData = (variantId: string) => {
  const { loading, result, error } = useLazyResultQuery<any>(TAB_FREQUENCIES_QUERY, {
    variables: {
      sqon: buildVariantIdSqon(variantId),
    },
  });

  const node = result?.variants?.hits?.edges[0]?.node;

  return {
    loading,
    data: {
      frequencies: node?.frequencies || {},
      studies: node?.studies?.hits?.edges || [],
      participant_number: node?.participant_number || 0,
      participant_ids: node?.participant_ids || [],
    },
    error,
  };
};

export const useTabFrequenciesStudiesData = (studiesIds: string[]) => {
  const { loading, result, error } = useLazyResultQuery<StudyInfoResults>(
    TAB_FREQUENCIES_STUDY_ID_CODE,
    {
      variables: {
        sqon: {
          content: [
            {
              content: {
                field: 'kf_id',
                value: studiesIds,
              },
              op: 'in',
            },
          ],
          op: 'and',
        },
      },
    },
  );

  const nodes = result?.studies?.hits?.edges;

  return {
    loadingStudies: loading,
    dataStudies: nodes?.map((n) => n.node),
    errorStudies: error,
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
