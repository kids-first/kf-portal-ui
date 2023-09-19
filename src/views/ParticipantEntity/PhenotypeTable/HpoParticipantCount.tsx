import { Link } from 'react-router-dom';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { useParticipantsFromField } from 'graphql/participants/actions';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { STATIC_ROUTES } from 'utils/routes';
import { numberWithCommas } from 'utils/string';

interface OwnProps {
  phenotype: string;
}

const HpoParticipantCount = ({ phenotype }: OwnProps) => {
  const { total } = useParticipantsFromField({
    field: 'observed_phenotype.name',
    value: phenotype,
  });

  return (
    <Link
      to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
      onClick={() =>
        addQuery({
          queryBuilderId: DATA_EXPLORATION_QB_ID,
          query: generateQuery({
            newFilters: [
              generateValueFilter({
                field: 'observed_phenotype.name',
                value: [phenotype],
                index: INDEXES.PARTICIPANT,
              }),
            ],
          }),
          setAsActive: true,
        })
      }
    >
      {numberWithCommas(total)}
    </Link>
  );
};

export default HpoParticipantCount;
