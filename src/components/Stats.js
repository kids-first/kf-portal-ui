import React from 'react';
import filesize from 'filesize';
import { Stats, CombinedStatsQuery } from '@arranger/components/dist/Arranger';

export const config = [
  {
    label: 'Files',
    isRoot: true,
    icon: (
      <img
        src={require('../assets/icon-files.svg')}
        alt=""
        css={`
          width: 16px;
          height: 20px;
          margin-right: 10px;
        `}
      />
    ),
  },
  {
    label: 'Participants',
    field: 'participants.kf_id',
    icon: (
      <img
        src={require('../assets/icon-participants.svg')}
        alt=""
        css={`
          width: 21px;
          height: 26px;
          margin-right: 10px;
        `}
      />
    ),
  },
  {
    label: 'Families',
    field: 'participants.family_id',
    icon: (
      <img
        src={require('../assets/icon-families-grey.svg')}
        alt=""
        css={`
          width: 26px;
          height: 23px;
          margin-right: 10px;
        `}
      />
    ),
  },
  {
    label: 'Size',
    field: 'size',
    dataAccessor: 'stats.sum',
    formatResult: x => filesize(x || 0).toUpperCase(),
    icon: (
      <img
        src={require('../assets/icon-database.svg')}
        alt=""
        css={`
          width: 18px;
          height: 22px;
          margin-right: 10px;
        `}
      />
    ),
  },
];

export const FileRepoStatsQuery = props => <CombinedStatsQuery {...props} stats={config} />;

export const FileRepoStats = props => <Stats {...props} stats={config} />;
