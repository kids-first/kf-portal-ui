import React from 'react';
import { Tabs, Tag, Typography } from 'antd';
import { FileTextOutlined, MedicineBoxOutlined, RiseOutlined } from '@ant-design/icons';

import styles from './VariantEntity.module.scss';
import SummaryTab from './SummaryTab';
import PageContent from 'components/Layout/PageContent';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import FrequenciesTab from './FrequenciesTab';

const { TabPane } = Tabs;

const { Title } = Typography;

type OwnProps = {
  variantId: string;
};

//TODO query url

const VariantEntity = (props: OwnProps) => {
  const { variantId } = props;
  return (
    <PageContent
      title={
        <>
          <StackLayout horizontal>
            <Title level={3}>{variantId}</Title>
            <Tag className={styles.variantTag}>Germline</Tag>
          </StackLayout>
        </>
      }
    >
      <Tabs defaultActiveKey="2">
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Summary
            </span>
          }
          key="1"
        >
          <SummaryTab />
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
          <FrequenciesTab variantId={variantId} />
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
    </PageContent>
  );
};

export default VariantEntity;
