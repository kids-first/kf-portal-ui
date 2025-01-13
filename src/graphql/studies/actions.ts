import { IQueryVariable } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { INDEXES } from 'graphql/constants';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IStudyEntity, IStudyResultTree } from './models';
import { GET_STUDIES_ENTITY, SEARCH_STUDIES_QUERY } from './queries';

export const useStudies = (variables?: IQueryVariable) => {
  const { loading, result } = useLazyResultQuery<IStudyResultTree>(SEARCH_STUDIES_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.study?.hits?.edges || []),
    total: result?.study?.hits?.total || 0,
  };
};

interface IUseStudyEntityProps {
  field: string;
  values: string[];
}

interface IUseStudyEntityReturn {
  loading: boolean;
  data?: IStudyEntity[];
}

export const useStudiesEntity = ({
  field,
  values,
}: IUseStudyEntityProps): IUseStudyEntityReturn => {
  const sqon = {
    content: [{ content: { field, value: values, index: INDEXES.STUDIES }, op: 'in' }],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IStudyResultTree>(GET_STUDIES_ENTITY, {
    variables: { sqon },
  });

  const data = result?.study?.hits?.edges?.map((study) => study.node);

  return {
    loading,
    data,
  };
};
