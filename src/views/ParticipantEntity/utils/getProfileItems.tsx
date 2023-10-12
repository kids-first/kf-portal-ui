import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tag } from 'antd';
import { IParticipantEntity, Sex } from 'graphql/participants/models';
import { capitalize } from 'lodash';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';

const getVitalStatus = (participant?: IParticipantEntity) => {
  const vitalStatuses = new Set();
  participant?.outcomes?.hits?.edges?.forEach((o) => {
    const vitalStatus = o.node.vital_status;
    if (vitalStatus) {
      vitalStatuses.add(vitalStatus);
    }
  });

  return vitalStatuses.size ? vitalStatuses : TABLE_EMPTY_PLACE_HOLDER;
};

const getProfileItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.participant.race'),
    value: participant?.race || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.participant.ethnicity'),
    value: participant?.ethnicity || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    label: intl.get('entities.participant.sex'),
    value: (
      <Tag
        color={
          participant?.sex === Sex.FEMALE
            ? 'magenta'
            : participant?.sex === Sex.MALE
            ? 'geekblue'
            : ''
        }
      >
        {capitalize(participant?.sex)}
      </Tag>
    ),
  },
  {
    label: intl.get('entities.participant.vital_status'),
    value: getVitalStatus(participant),
  },
];

export default getProfileItems;
