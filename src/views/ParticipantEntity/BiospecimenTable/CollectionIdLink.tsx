import { Link } from 'react-router-dom';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { INDEXES } from 'graphql/constants';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import { STATIC_ROUTES } from 'utils/routes';

interface OwnProps {
  collectionId: string;
}

const CollectionIdLink = ({ collectionId }: OwnProps) => (
  <Link
    to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
    onClick={() =>
      addQuery({
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        query: generateQuery({
          newFilters: [
            generateValueFilter({
              field: 'collection_sample_id',
              value: [collectionId],
              index: INDEXES.BIOSPECIMEN,
            }),
          ],
        }),
        setAsActive: true,
      })
    }
  >
    {collectionId}
  </Link>
);

export default CollectionIdLink;
