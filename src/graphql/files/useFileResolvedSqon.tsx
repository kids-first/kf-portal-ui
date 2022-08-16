import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { mapFilterForFiles } from 'utils/fieldMapper';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';

const useFileResolvedSqon = (queryBuilderId: string) => {
  const { queryList, activeQuery } = useQueryBuilderState(queryBuilderId);

  return {
    sqon: mapFilterForFiles(resolveSyntheticSqon(queryList, activeQuery)),
  };
};

export default useFileResolvedSqon;
