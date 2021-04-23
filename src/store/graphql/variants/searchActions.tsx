import { SEARCH_VARIANT_TABLE_QUERY } from './queries';
import { buildVariantIdSqon, useLazyResultQuery } from 'store/graphql/utils/query';
import { GenomicFeatureType, SelectedSuggestion, StudyInfo, VariantEntityNode } from './models';

const MAX_NUMBER_STUDIES = 2000;

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

export const SEARCH_PAGE_SIZE = 10;

const computeOffSet = (pageNum: number) => SEARCH_PAGE_SIZE * (pageNum - 1);

export const useVariantSearchTableData = (
  selectedSuggestion: SelectedSuggestion,
  pageNum: number,
) => {
  const { loading, result, error } = useLazyResultQuery<any>(SEARCH_VARIANT_TABLE_QUERY, {
    variables: {
      sqon: buildSearchTableSqon(selectedSuggestion),
      pageSize: SEARCH_PAGE_SIZE,
      offset: computeOffSet(pageNum),
      sort: [{ field: 'impact_score', order: 'desc' }],
      studiesSize: MAX_NUMBER_STUDIES,
    },
  });

  const nodes = result?.variants?.hits?.edges || [];

  const variants = nodes as VariantEntityNode[];

  const total = result?.variants?.hits?.total || 0;

  const nodesStudies = result?.studies?.hits?.edges || [];
  const studies = nodesStudies.map((n: { node: string }) => n.node) as StudyInfo[];

  return {
    loading,
    results: {
      variants,
      total,
    },
    error,
    studies: studies,
  };
};
