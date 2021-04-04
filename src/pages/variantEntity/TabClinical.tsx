import React, { FC } from 'react';
import { Space, Spin, Table } from 'antd';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { useTabClinicalData } from 'store/graphql/variants/tabActions';

type OwnProps = {
  variantId: string;
};
const TabClinical: FC<OwnProps> = ({ variantId }) => {
  const { loading } = useTabClinicalData(variantId);
  return (
    <Spin spinning={loading}>
      <StackLayout vertical fitContent>
        <Space direction={'vertical'} size={'large'}>
          <Table title={() => 'title'} bordered dataSource={[]} columns={[]} />
          <Table title={() => 'title'} bordered dataSource={[]} columns={[]} />
        </Space>
      </StackLayout>
    </Spin>
  );
};

export default TabClinical;
