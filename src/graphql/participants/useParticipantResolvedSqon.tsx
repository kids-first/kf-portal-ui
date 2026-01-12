import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';

import { mapFilterForParticipant } from 'utils/fieldMapper';

const useParticipantResolvedSqon = (queryBuilderId: string) => {
  const { queryList, activeQuery } = useQueryBuilderState(queryBuilderId);

  return {
    sqon: mapFilterForParticipant(resolveSyntheticSqon(queryList, activeQuery)),
  };
};

export default useParticipantResolvedSqon;
