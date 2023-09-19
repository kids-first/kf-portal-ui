import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tag, Tooltip } from 'antd';
import { IParticipantEntity, Sex } from 'graphql/participants/models';
import { capitalize } from 'lodash';

import styles from '../styles/styles.module.scss';

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
    label: (
      <Tooltip
        className={styles.tooltip}
        title={
          <>
            <div>{intl.get('entities.participant.trisomy')}</div>
            <div>{intl.get('entities.participant.disomy')}</div>
          </>
        }
      >
        {intl.get('entities.participant.down_syndrome_status')}
      </Tooltip>
    ),
    value: participant?.down_syndrome_status,
  },
];

export default getProfileItems;
