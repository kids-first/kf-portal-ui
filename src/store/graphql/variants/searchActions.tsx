import { useLazyResultQuery } from 'store/graphql/utils/query';

import { SelectedSuggestion, StudyInfo, VariantEntityNode } from './models';
import { SEARCH_VARIANT_TABLE_QUERY } from './queries';

const MAX_NUMBER_STUDIES = 2000;

//TODO should be the filter sqon as input
const buildSearchTableSqon = () => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {},
    },
  ],
});

const computeOffSet = (pageNum: number, pageSize: number) => pageSize * (pageNum - 1);

export const useVariantSearchTableData = (
  selectedSuggestion: SelectedSuggestion,
  pageNum: number,
  pageSize: number,
) => {
  const { loading, result, error } = useLazyResultQuery<any>(SEARCH_VARIANT_TABLE_QUERY, {
    variables: {
      sqon: buildSearchTableSqon(), //todo filter sqon
      pageSize: pageSize,
      offset: computeOffSet(pageNum, pageSize),
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
