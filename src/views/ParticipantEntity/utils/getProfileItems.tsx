import React from 'react';
import intl from 'react-intl-universal';
import { IEntityDescriptionsItem } from '@ferlab/ui/core/pages/EntityPage';
import { Tag, Tooltip } from 'antd';
import { IParticipantEntity, Sex } from 'graphql/participants/models';
import { capitalize } from 'lodash';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import OutcomesAgeCells from 'components/OutcomesAgeCells';

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

const getAgeAtVitalStatus = (participant?: IParticipantEntity) => {
  const vitalStatuses = new Set();
  participant?.outcomes?.hits?.edges?.forEach((o) => {
    const vitalStatus = o.node.age_at_event_days.value;
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
  {
    label: (
      <Tooltip title={intl.get('entities.participant.age_at_outcome_tooltip')}>
        {intl.get('entities.participant.age')}
      </Tooltip>
    ),
    value: <OutcomesAgeCells outcomes={participant?.outcomes} />,
  },
];

export default getProfileItems;
