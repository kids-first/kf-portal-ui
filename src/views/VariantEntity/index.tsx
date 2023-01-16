import { useParams } from 'react-router-dom';
import VariantEntityPage from '@ferlab/ui/core/pages/VariantEntity';
import { INDEXES } from 'graphql/constants';
import { useVariantEntity } from 'graphql/variants/actions';
import { DATA_EXPLORATION_QB_ID } from 'views/DataExploration/utils/constant';

import Spinner from 'components/uiKit/Spinner';
import { STATIC_ROUTES } from 'utils/routes';
import { getVariantEntityDictionary } from 'utils/translation';

export default function VariantEntity() {
  const { locus } = useParams<{ locus: string }>();

  const { data, loading } = useVariantEntity({
    field: 'locus',
    values: [locus],
  });

  const participantQueryParams = {
    field: 'participant_id',
    index: INDEXES.PARTICIPANT,
    queryBuilderId: DATA_EXPLORATION_QB_ID,
    route: STATIC_ROUTES.DATA_EXPLORATION,
  };

  return (
    <>
      {data ? (
        <VariantEntityPage
          variant={data}
          loading={loading}
          participantQueryParams={participantQueryParams}
          dictionary={getVariantEntityDictionary()}
        />
      ) : (
        <Spinner size={'large'} />
      )}
    </>
  );
}
