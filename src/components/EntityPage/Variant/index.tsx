import React from 'react';

import { useGetVariantEntityPageData } from './actions';
import { Layout, Tabs, Typography } from 'antd';
import styles from 'pages/variants/Variants.module.scss';

type OwnProps = {
  variantId: string;
};

const { TabPane } = Tabs;
const { Title } = Typography;

const VariantEntity = (props: OwnProps) => {
  const filters = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: 'hash',
          value: [`${props.variantId}`],
        },
      },
    ],
  };

  let variantResult = useGetVariantEntityPageData({ sqon: filters });
  console.log(variantResult);

  return (
    <Layout className={styles.layout}>
      <Title level={3}>h3. Ant Design</Title>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Summary" key="1">
          Summary content
        </TabPane>
        <TabPane tab="Frequencies" key="2">
          Frequencies content
        </TabPane>
        <TabPane tab="Clinical Associations" key="3">
          Clinical Associations content
        </TabPane>
        <TabPane tab="Patients" key="4">
          Clinical Associations content
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default VariantEntity;
