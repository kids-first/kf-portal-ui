/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';

import './DownloadButton.css';
import { Menu } from 'antd';
import { Sqon } from '../../store/sqon';
import {
  RP_BIOSPECIMEN_FILE_REPO_DATA_KEY,
  RP_PARTICIPANT_FILE_REPO_KEY,
  RP_FAM_CLINICAL_DATA_FILE_REPO_KEY,
} from '../../services/report';
import ReportsButton from '../../ui/ReportsButton';

type Props = {
  sqon: Sqon;
};

const DownloadButton: FunctionComponent<Props> = (props) => {
  const { sqon } = props;
  const generatorMenuItems = () => [
    <Menu.Item key={RP_PARTICIPANT_FILE_REPO_KEY}>{'Clinical Data: Participants only'}</Menu.Item>,
    <Menu.Item key={RP_FAM_CLINICAL_DATA_FILE_REPO_KEY}>
      {'Clinical Data: Participant & Family Members'}
    </Menu.Item>,
    <Menu.Item key={RP_BIOSPECIMEN_FILE_REPO_DATA_KEY}>{'Biospecimen Data'}</Menu.Item>,
  ];
  return (
    <ReportsButton
      sqon={sqon}
      generatorMenuItems={generatorMenuItems}
      className={'download-btn-file-repo'}
    />
  );
};

export default DownloadButton;
