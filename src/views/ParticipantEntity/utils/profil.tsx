import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tag } from 'antd';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import intl from 'react-intl-universal';

export const getProfilItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => {
  const outcomes = hydrateResults(participant?.outcomes.hits.edges || []);

  return [
    {
      label: intl.get('screen.participantEntity.profil.race'),
      value: participant?.race || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.profil.ethnicity'),
      value: participant?.ethnicity || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.profil.sex'),
      value: participant?.sex || TABLE_EMPTY_PLACE_HOLDER,
    },
    {
      label: intl.get('screen.participantEntity.profil.vitalStatus'),
      value: outcomes.length
        ? outcomes.map(({ vital_status }) => <Tag key={vital_status}>{vital_status}</Tag>)
        : TABLE_EMPTY_PLACE_HOLDER,
    },
  ];
};
