/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Sqon } from '../../../store/sqon';
import { Menu } from 'antd';
import ReportsButton from '../../../ui/ReportsButton';
import {
  RP_BIOSPECIMEN_DATA_KEY,
  RP_CLINICAL_DATA_KEY,
  RP_FAM_CLINICAL_DATA_KEY,
} from '../../../services/report';

type Props = {
  sqon: Sqon;
};

const DownloadButton: FunctionComponent<Props> = ({ sqon }) => {
  const generatorMenuItems = () => [
    <Menu.Item key={RP_CLINICAL_DATA_KEY}>{'Clinical Data: Participants only'}</Menu.Item>,
    <Menu.Item key={RP_FAM_CLINICAL_DATA_KEY}>
      {'Clinical Data: Participant & Family Members'}
    </Menu.Item>,
    <Menu.Item key={RP_BIOSPECIMEN_DATA_KEY}>{'Biospecimen Data'}</Menu.Item>,
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
