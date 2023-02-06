import {
  IQueryOperationsConfig,
  IQueryResults,
  IQueryVariable,
} from '@ferlab/ui/core/graphql/types';
import { computeSearchAfter, hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IVariantEntity as IVariantEntityFerlab } from '@ferlab/ui/core/pages/EntityPage/type';
import { INDEXES } from 'graphql/constants';

import useLazyResultQuery from 'hooks/graphql/useLazyResultQuery';

import { IVariantEntity, IVariantEntityResultTree, IVariantResultTree } from './models';
import { GET_VARIANT_ENTITY, SEARCH_VARIANT_QUERY } from './queries';

export const useVariant = (
  variables?: IQueryVariable,
  operations?: IQueryOperationsConfig,
): IQueryResults<IVariantEntity[]> => {
  const { loading, result } = useLazyResultQuery<IVariantResultTree>(SEARCH_VARIANT_QUERY, {
    variables,
  });

  return {
    loading,
    data: hydrateResults(result?.variants?.hits?.edges || [], operations?.previous),
    total: result?.variants?.hits?.total || 0,
    searchAfter: computeSearchAfter(result?.variants?.hits?.edges || [], operations),
  };
};

interface IUseVariantEntityProps {
  field: string;
  values: string[];
}

interface IUseVariantEntityReturn {
  loading: boolean;
  data?: IVariantEntityFerlab;
}

export const useVariantEntity = ({
  field,
  values,
}: IUseVariantEntityProps): IUseVariantEntityReturn => {
  const sqon = {
    content: [{ content: { field, value: values, index: INDEXES.VARIANTS }, op: 'in' }],
    op: 'and',
  };

  const { loading, result } = useLazyResultQuery<IVariantEntityResultTree>(GET_VARIANT_ENTITY, {
    variables: { sqon },
  });

  const data = result?.variants?.hits?.edges[0].node;

  return {
    loading,
    data,
  };
};
