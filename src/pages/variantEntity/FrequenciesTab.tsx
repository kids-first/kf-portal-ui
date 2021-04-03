import React, { FC } from 'react';
import { Space } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import TableStudies from './TableStudies';

type OwnProps = {
  variantId: string;
};

const Frequencies: FC<OwnProps> = ({ variantId }) => (
  <StackLayout vertical fitContent>
    <Space direction={'vertical'} size={'large'}>
      <TableStudies variantId={variantId} />
    </Space>
  </StackLayout>
);

export default Frequencies;
