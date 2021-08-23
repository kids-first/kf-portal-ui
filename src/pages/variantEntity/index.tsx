import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FileTextOutlined, MedicineBoxOutlined, RiseOutlined } from '@ant-design/icons';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Tabs, Tag, Typography } from 'antd';

import PageContent from 'components/Layout/PageContent';
import useTab from 'hooks/useTab';

import TabClinical from './TabClinical';
import TabFrequencies from './TabFrequencies';
import TabSummary from './TabSummary';

import styles from './VariantEntity.module.scss';
const { TabPane } = Tabs;

const { Title } = Typography;

const mTabKeys = {
  clinical: 'clinical',
  frequencies: 'frequencies',
  summary: 'summary',
};

const tabKeyValues = Object.keys(mTabKeys);

const VariantEntity = () => {
  const { hash } = useParams();
  const location = useLocation();
  const hgvsg = new URLSearchParams(location.search).get('hgvsg');

  const [tabKey, setTabKey] = useTab(tabKeyValues, mTabKeys.summary);

  return (
    <PageContent
      className={styles.pageContent}
      title={
        <StackLayout horizontal>
          <Title level={3}>{hgvsg}</Title>
          <Tag className={styles.variantTag}>Germline</Tag>
        </StackLayout>
      }
    >
      <Tabs activeKey={tabKey} onChange={setTabKey}>
        <TabPane
          tab={
            <span>
              <FileTextOutlined />
              Summary
            </span>
          }
          key={mTabKeys.summary}
        >
          <TabSummary variantId={hash} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <RiseOutlined />
              Frequencies
            </span>
          }
          key={mTabKeys.frequencies}
        >
          <TabFrequencies variantId={hash} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <MedicineBoxOutlined />
              Clinical Associations
            </span>
          }
          key={mTabKeys.clinical}
        >
          <TabClinical variantId={hash} />
        </TabPane>
      </Tabs>
    </PageContent>
  );
};

export default VariantEntity;
