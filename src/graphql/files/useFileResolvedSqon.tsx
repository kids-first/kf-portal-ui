import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';

import { mapFilterForFiles } from 'utils/fieldMapper';

const useFileResolvedSqon = (queryBuilderId: string) => {
  const { queryList, activeQuery } = useQueryBuilderState(queryBuilderId);

  return {
    sqon: mapFilterForFiles(resolveSyntheticSqon(queryList, activeQuery)),
  };
};

export default useFileResolvedSqon;
