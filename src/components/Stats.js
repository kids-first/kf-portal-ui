import React from 'react';
import filesize from 'filesize';
import { Stats, CombinedStatsQuery } from '@kfarranger/components/dist/Arranger';

export const config = [
  {
    label: 'Files',
    isRoot: true,
    icon: (
      <img
        src={require('../assets/icon-files.svg')}
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
        src={require('../assets/icon-participants.svg')}
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
        src={require('../assets/icon-families-grey.svg')}
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
    formatResult: x => filesize(x || 0).toUpperCase(),
    icon: (
      <img
        src={require('../assets/icon-database.svg')}
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

export const FileRepoStatsQuery = props => <CombinedStatsQuery {...props} stats={config} />;

export const FileRepoStats = props => <Stats {...props} stats={config} />;
