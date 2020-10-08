/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { Typography, Table } from 'antd';
import { participantStatsHeader } from './statVisuals';
import { CheckCircleTwoTone } from '@ant-design/icons';

type OwnProps = {
  isFamilyMemberFilesAvailable: boolean;
  participantsMemberCount: number;
  participantFilesCount: number;
  size: number;
  checkIconClassName: string;
};

const { Paragraph } = Typography;

const ParticipantsSection: FunctionComponent<OwnProps> = ({
  isFamilyMemberFilesAvailable,
  participantsMemberCount,
  participantFilesCount,
  size,
  checkIconClassName,
}) => (
  <>
    <Paragraph>{' - all files will be included in the manifest'}</Paragraph>
    <Table
      title={() => 'Participants Summary'}
      footer={() => ''}
      columns={participantStatsHeader}
      dataSource={[
        {
          key: '1',
          datatypes: {
            fileType: 'All',
            isChecked: isFamilyMemberFilesAvailable,
            leftComponent: <CheckCircleTwoTone className={checkIconClassName} />,
          },
          participants: participantsMemberCount,
          files: participantFilesCount,
          size,
        },
      ]}
      pagination={false}
    />
  </>
);

export default ParticipantsSection;
