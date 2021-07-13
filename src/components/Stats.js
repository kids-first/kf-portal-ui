import React from 'react';
import { CombinedStatsQuery } from '@kfarranger/components/dist/Arranger';

import fileSizeStatVisualPath from 'assets/icon-database.svg';
import familyMembersStatVisualPath from 'assets/icon-families-grey.svg';
import fileStatVisualPath from 'assets/icon-files.svg';
import participantsStatIconPath from 'assets/icon-participants.svg';
import { formatBytesToHumanReadable } from 'utils';

export const config = [
  {
    label: 'Files',
    isRoot: true,
    icon: (
      <img
        src={fileStatVisualPath}
        alt=""
        style={{
          width: '16px',
          height: '20px',
          marginRight: '10px',
        }}
      />
    ),
  },
  {
    label: 'Participants',
    field: 'participants.kf_id',
    icon: (
      <img
        src={participantsStatIconPath}
        alt=""
        style={{
          width: '21px',
          height: '26px',
          marginRight: '10px',
        }}
      />
    ),
  },
  {
    label: 'Families',
    field: 'participants.family_id',
    icon: (
      <img
        src={familyMembersStatVisualPath}
        alt=""
        style={{
          width: '26px',
          height: '23px',
          marginRight: '10px',
        }}
      />
    ),
  },
  {
    label: 'Size',
    field: 'size',
    dataAccessor: 'stats.sum',
    formatResult: (x) => formatBytesToHumanReadable(x || 0),
    icon: (
      <img
        src={fileSizeStatVisualPath}
        alt=""
        style={{
          width: '18px',
          height: '22px',
          marginRight: '10px',
        }}
      />
    ),
  },
];

export const FileRepoStatsQuery = (props) => <CombinedStatsQuery {...props} stats={config} />;
