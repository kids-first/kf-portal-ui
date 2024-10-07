import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';

import { mapFilterForBiospecimen } from 'utils/fieldMapper';

const useBiospecimenResolvedSqon = (queryBuilderId: string) => {
  const { queryList, activeQuery } = useQueryBuilderState(queryBuilderId);

  return {
    sqon: mapFilterForBiospecimen(resolveSyntheticSqon(queryList, activeQuery)),
  };
};

export default useBiospecimenResolvedSqon;
