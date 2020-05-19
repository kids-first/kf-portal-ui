/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Sqon } from '../../../types';
import { Menu, message } from 'antd';
import {
  biospecimenDataReport,
  clinicalDataReport,
  familyClinicalDataReport,
} from 'services/reports';
import ReportsButton from 'ui/ReportsButton';

type Props = {
  sqon: Sqon;
};

const download = async (reportName: string, sqon: Sqon) => {
  const reportMap: { [index: string]: Function } = {
    clinicalData: clinicalDataReport,
    familyClinicalData: familyClinicalDataReport,
    biospecimenData: biospecimenDataReport,
  };

  const hideLoadingMessage = message.loading('Please wait while we generate your report', 0);
  try {
    const reportFn = reportMap[reportName];
    await reportFn(sqon);
  } finally {
    //Clean and throw if necessary to caller
    hideLoadingMessage();
  }
};

const DownloadButton: FunctionComponent<Props> = ({ sqon }) => {
  const generatorMenuItems = () => [
    <Menu.Item key="clinicalData">{'Clinical Data: Participants only'}</Menu.Item>,
    <Menu.Item key="familyClinicalData">{'Clinical Data: Participant & Family Members'}</Menu.Item>,
    <Menu.Item key="biospecimenData">{'Biospecimen Data'}</Menu.Item>,
  ];
  return <ReportsButton sqon={sqon} generatorMenuItems={generatorMenuItems} action={download} />;
};

export default DownloadButton;
