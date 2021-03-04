import { STUDIES_PAGE_DATA } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { StudiesResult } from 'store/graphql/studies/models';

export const getStudiesPageData = () => () => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_PAGE_DATA, {
    variables: [],
  });

  return {
    loading,
    results: result?.study.hits.edges.map((edge: { node: StudiesResult }) => ({
      ...edge.node,
    })),
  };
};
