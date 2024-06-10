import { Link } from 'react-router-dom';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { STATIC_ROUTES } from 'utils/routes';

import styles from '../styles/styles.module.css';

interface OwnProps {
  familyId: string;
}

const FamilyIdLink = ({ familyId }: OwnProps) => (
  <Link
    className={styles.link}
    to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
    onClick={() => {
      addQuery({
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        query: generateQuery({
          newFilters: [
            generateValueFilter({
              field: 'family.family_id',
              value: [familyId],
              index: INDEXES.PARTICIPANT,
            }),
          ],
        }),
        setAsActive: true,
      });
    }}
  >
    {familyId}
  </Link>
);

export default FamilyIdLink;
