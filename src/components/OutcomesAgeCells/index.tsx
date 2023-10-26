import React from 'react';
import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { IParticipantOutcomes } from 'graphql/participants/models';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import AgeCell from 'components/AgeCell';
import { isNumber } from 'utils/helper';

interface OwnProps {
  outcomes?: IArrangerResultsTree<IParticipantOutcomes>;
}

const OutcomesAgeCells = ({ outcomes }: OwnProps) => {
  const outcomeAges: number[] =
    outcomes?.hits?.edges.map((x) => x.node?.age_at_event_days?.value).filter((x) => isNumber(x)) ||
    [];
  return (
    <>
      {outcomeAges.length > 0
        ? outcomeAges.map((age: number, index: number) => (
            <AgeCell key={`${index}-${age}`} ageInDays={age} />
          ))
        : TABLE_EMPTY_PLACE_HOLDER}
    </>
  );
};

export default OutcomesAgeCells;
