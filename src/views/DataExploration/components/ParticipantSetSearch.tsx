import { INDEXES } from 'graphql/constants';
import useParticipantResolvedSqon from 'graphql/participants/useParticipantResolvedSqon';

import { ICustomSearchProps } from 'components/uiKit/search/GlobalSearch';
import SetSearch from 'components/uiKit/search/SetSearch';
import { SetType } from 'services/api/savedSet/models';

import { DATA_EXPLORATION_QB_ID } from '../utils/constant';

const ParticipantSetSearch = ({ queryBuilderId }: ICustomSearchProps) => {
  const { sqon } = useParticipantResolvedSqon(queryBuilderId);

  return (
    <SetSearch
      index={INDEXES.PARTICIPANT}
      title="Saved participant sets"
      queryBuilderId={DATA_EXPLORATION_QB_ID}
      type={SetType.PARTICIPANT}
      sqon={sqon}
      emptyDescription={'No participant sets found'}
    />
  );
};

export default ParticipantSetSearch;
