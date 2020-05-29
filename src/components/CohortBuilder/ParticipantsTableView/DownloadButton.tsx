/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Sqon } from 'store/sqon';
import { Menu } from 'antd';
import ReportsButton from 'ui/ReportsButton';
import {
  RP_BIOSPECIMEN_DATA_KEY,
  RP_CLINICAL_DATA_KEY,
  RP_FAM_CLINICAL_DATA_KEY,
} from 'services/report';

type Props = {
  sqon: Sqon;
};

const Item = Menu.Item;

const DownloadButton: FunctionComponent<Props> = ({ sqon }) => {
  const generatorMenuItems = () => [
    <Item key={RP_CLINICAL_DATA_KEY}>{'Clinical Data: Participants only'}</Item>,
    <Item key={RP_FAM_CLINICAL_DATA_KEY}>{'Clinical Data: Participant & Family Members'}</Item>,
    <Item key={RP_BIOSPECIMEN_DATA_KEY}>{'Biospecimen Data'}</Item>,
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
