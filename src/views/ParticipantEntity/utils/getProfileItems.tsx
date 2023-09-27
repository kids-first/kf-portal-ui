import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tag } from 'antd';
import { IParticipantEntity, Sex } from 'graphql/participants/models';
import { capitalize } from 'lodash';

const getProfileItems = (participant?: IParticipantEntity): IEntityDescriptionsItem[] => [
  {
    label: intl.get('entities.participant.race'),
    value: participant?.race,
  },
  {
    label: intl.get('entities.participant.ethnicity'),
    value: participant?.ethnicity,
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
    value: [...new Set(participant?.outcomes?.hits?.edges?.map((o) => o.node.vital_status))],
  },
];

export default getProfileItems;
