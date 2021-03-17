/* eslint-disable react/display-name */
import React, { FC } from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';

import PageContent from 'components/Layout/PageContent';
import StudiesFiltersSider from './StudiesFiltersSider';
import StudyPageContainer from './StudyPageContainer';
import { Layout } from 'antd';

import styles from './studies.module.scss';

const Studies: FC = () => (
  <Layout className={styles.layout}>
    <StudiesFiltersSider />
    <ScrollView className={styles.scrollContent}>
      <PageContent title="Studies">
        <StudyPageContainer />
      </PageContent>
    </ScrollView>
  </Layout>
);

export default Studies;
