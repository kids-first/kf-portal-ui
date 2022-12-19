import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tag } from 'antd';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { DYNAMIC_ROUTES } from 'utils/routes';

export const getSummaryItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => {
  const diagnosis = hydrateResults(participant?.diagnosis?.hits?.edges || []);

  return [
    {
      label: intl.get('screen.participantEntity.summary.id'),
      value: participant?.participant_id || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.externalId'),
      value: participant?.external_id || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.study'),
      value: participant?.study.study_name ? (
        <Link to={`${DYNAMIC_ROUTES.STUDY_ENTITY}/${participant?.study.study_code}`}>
          {participant?.study.study_name} ({participant?.study.study_code})
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    },
    {
      label: intl.get('screen.participantEntity.summary.diagnosisCategory'),
      value: diagnosis.length
        ? diagnosis.map(({ source_text }) => <Tag key={source_text}>{source_text}</Tag>)
        : TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.familyComposition'),
      value: participant?.family_type || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.summary.proband'),
      value: participant?.is_proband ? (
        <Tag>{intl.get('screen.participantEntity.summary.proband')}</Tag>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
    },
  ];
};
