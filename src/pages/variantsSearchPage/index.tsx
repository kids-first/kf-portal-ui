import React, { useState } from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import { Button, Layout, Modal, Tag, Typography } from 'antd';

import PageContent from 'components/Layout/PageContent';
import OpenInNewIcon from 'icons/OpenInNewIcon';

import Sidebar from './Sidebar';
import VariantPageContainer from './VariantPageContainer';
import VariantStats from './VariantStats';

import styles from './VariantsSearchPage.module.scss';

// <WorkBench isAllowed={isKfInvestigator(groups)} />

const { Title } = Typography;

const VariantPage = () => {
  const [statsModalOpened, setStatsModalOpened] = useState(false);

  return (
    <Layout className={styles.layout}>
      <Sidebar /*filters={{}}*/ />
      <ScrollView className={styles.scrollContent}>
        <PageContent
          title={
            <div className={styles.pageHeader}>
              <Title className={styles.pageHeaderTitle} level={1}>
                Kids First Variants
              </Title>
              <Tag className={styles.dataReleaseTag} onClick={() => setStatsModalOpened(true)}>
                <span>Data release 1.0</span>
                <OpenInNewIcon fill="#00546E" width="12"></OpenInNewIcon>
              </Tag>
            </div>
          }
        >
          <VariantPageContainer></VariantPageContainer>
        </PageContent>
      </ScrollView>
      <Modal
        width={685}
        onCancel={() => setStatsModalOpened(false)}
        title={
          <div className={styles.statsModalHeader}>
            <Title className={styles.statsTitle} level={3}>
              Data Release 1
            </Title>
            <div className={styles.releaseDate}>January 21th, 2021</div>
          </div>
        }
        visible={statsModalOpened}
        footer={[
          <Button type="primary" key="ok" onClick={() => setStatsModalOpened(false)}>
            Ok
          </Button>,
        ]}
      >
        <VariantStats />
      </Modal>
    </Layout>
  );
};
export default VariantPage;
