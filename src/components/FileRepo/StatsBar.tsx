import React, { FunctionComponent } from 'react';
import Stat from './Stat';
import {
  buildStatQueriesForFamily,
  buildStatQueriesForFile,
  buildStatQueriesForFileHits,
  buildStatQueriesForParticipant,
} from './statsQueries';

import {
  familyStatTag,
  file_stat_tag,
  fileSizeStatTag,
  participantStatTag,
} from './statsConstants';
import './FileRepo.css';

interface Props {
  api: Function;
  sqon: any;
}

const separator = <div className={'separator'} />;

const StatsBar: FunctionComponent<Props> = ({ api, sqon }) => (
  <div className={'stats-bar-container'}>
    <Stat
      api={api}
      tag={file_stat_tag}
      queries={buildStatQueriesForFileHits(sqon)}
      label={'Files'}
      icon={
        <img
          src={require('../../assets/icon-files.svg')}
          alt=""
          style={{
            width: '16px',
            height: '20px',
            marginRight: '10px',
          }}
        />
      }
    />
    {separator}
    <Stat
      api={api}
      tag={participantStatTag}
      queries={buildStatQueriesForParticipant(sqon)}
      label={'Participants'}
      icon={
        <img
          src={require('../../assets/icon-participants.svg')}
          alt=""
          style={{
            width: '21px',
            height: '26px',
            marginRight: '10px',
          }}
        />
      }
    />
    {separator}
    <Stat
      api={api}
      tag={familyStatTag}
      queries={buildStatQueriesForFamily(sqon)}
      label={'Families'}
      icon={
        <img
          src={require('../../assets/icon-families-grey.svg')}
          alt=""
          style={{
            width: '26px',
            height: '23px',
            marginRight: '10px',
          }}
        />
      }
    />
    {separator}
    <Stat
      api={api}
      tag={fileSizeStatTag}
      queries={buildStatQueriesForFile(sqon)}
      label={'Size'}
      icon={
        <img
          src={require('../../assets/icon-database.svg')}
          alt=""
          style={{
            width: '18px',
            height: '22px',
            marginRight: '10px',
          }}
        />
      }
    />
  </div>
);

export default StatsBar;
