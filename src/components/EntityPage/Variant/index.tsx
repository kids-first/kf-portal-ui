import React from 'react';

import { useGetVariantEntityPageData } from './actions';
import { Layout, Tabs, Tag, Typography } from 'antd';
import { FileTextOutlined, MedicineBoxOutlined, RiseOutlined } from '@ant-design/icons';
import VariantSummaryContainer from './VariantSummaryContainer';

import styles from './variant.module.scss';

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
  return (
    <Layout className={styles.layout}>
      <div className={styles.headerContainer}>
        <Title level={3}>{variantResult.data?.hits.edges[0].node.hgvsg}</Title>
        <Tag className={styles.variantTag}>Germline</Tag>
      </div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Summary
            </span>
          }
          key="1"
        >
          <VariantSummaryContainer />
        </TabPane>
        <TabPane
          tab={
            <span>
              <RiseOutlined />
              Frequencies
            </span>
          }
          key="2"
        >
          Frequencies content
        </TabPane>
        <TabPane
          tab={
            <span>
              <MedicineBoxOutlined />
              Clinical Associations
            </span>
          }
          key="3"
        >
          Clinical Associations content
        </TabPane>
      </Tabs>
    </Layout>
  );
};

export default VariantEntity;
