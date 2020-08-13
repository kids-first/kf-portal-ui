/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react';
import { cavaticaWebRoot } from 'common/injectGlobals';
import { Button, Typography } from 'antd';

const { Paragraph, Text } = Typography;

type OwnProps = {
  selectedProjectData: {
    id: string;
    name: string;
  };
};

export const CavaticaSuccessNotificationContent: FunctionComponent<OwnProps> = ({
  selectedProjectData,
}) => (
  <>
    <Paragraph>
      Files were copied to your Cavatica project:{' '}
      <Text strong>{` ${selectedProjectData.name}`}</Text>
    </Paragraph>
    <Button
      type={'link'}
      onClick={() => window.open(`${cavaticaWebRoot}u/${selectedProjectData.id}`, '_blank')}
    >
      Open project in Cavatica
    </Button>
  </>
);
