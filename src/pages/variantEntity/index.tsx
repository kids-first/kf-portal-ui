import React from 'react';
import { useParams } from 'react-router-dom';
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

const hgvsgRegex = /^(hgvsg|locus)=([A-Za-z0-9:.>-]+)#?.*$/;

const extractHgvsg = (raw: string) => hgvsgRegex.exec(raw);

const VariantEntity = () => {
  const { hash } = useParams();
  const match = extractHgvsg(hash);
  const field = match ? match[1] : '';
  const value = match ? match[2] : '';

  const [tabKey, setTabKey] = useTab(tabKeyValues, mTabKeys.summary);

  return (
    <PageContent
      className={styles.pageContent}
      title={
        <StackLayout horizontal>
          <Title level={3}>{value}</Title>
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
          <TabSummary field={field} value={value} />
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
          <TabFrequencies field={field} value={value} />
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
          <TabClinical field={field} value={value} />
        </TabPane>
      </Tabs>
    </PageContent>
  );
};

export default VariantEntity;
