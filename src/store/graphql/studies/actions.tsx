import { STUDIES_QUERY } from './queries';
import { useLazyResultQuery } from 'store/graphql/utils/query';
import { StudiesResult } from 'store/graphql/studies/models';

export const getStudiesPageData = () => () => {
  const { loading, result } = useLazyResultQuery<any>(STUDIES_QUERY, {
    variables: [],
  });

  return {
    loading,
    results: result?.study.hits.edges.map((edge: { node: StudiesResult }) => ({
      ...edge.node,
    })),
  };
};
