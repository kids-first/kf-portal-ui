import React from 'react';
import { Tabs, Tag, Typography } from 'antd';
import { FileTextOutlined, MedicineBoxOutlined, RiseOutlined } from '@ant-design/icons';

import styles from './VariantEntity.module.scss';
import TabSummary from './TabSummary';
import PageContent from 'components/Layout/PageContent';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import TabFrequencies from './TabFrequencies';
import TabClinical from './TabClinical';
import useTab from 'hooks/useTab';

const { TabPane } = Tabs;

const { Title } = Typography;

type OwnProps = {
  variantId: string;
  hgvsg: string;
};

const mTabKeys = {
  clinical: 'clinical',
  frequencies: 'frequencies',
  summary: 'summary',
};

const tabKeyValues = Object.keys(mTabKeys);

const VariantEntity = (props: OwnProps) => {
  const { variantId, hgvsg } = props;

  const [tabKey, setTabKey] = useTab(tabKeyValues, mTabKeys.summary);

  return (
    <PageContent
      title={
        <>
          <StackLayout horizontal>
            <Title level={3}>{hgvsg}</Title>
            <Tag className={styles.variantTag}>Germline</Tag>
          </StackLayout>
        </>
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
          <TabSummary variantId={variantId} />
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
          <TabFrequencies variantId={variantId} />
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
          <TabClinical variantId={variantId} />
        </TabPane>
      </Tabs>
    </PageContent>
  );
};

export default VariantEntity;
