import React from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import { Layout } from 'antd';

import PageContent from 'components/Layout/PageContent';

//import useUser from '../../hooks/useUser';
import Sidebar from './Sidebar';
import VariantPageContainer from './VariantPageContainer';

import styles from './VariantsSearchPage.module.scss';

// <VariantStats />
// <SearchView />
// <WorkBench isAllowed={isKfInvestigator(groups)} />

const VariantPage = () => (
  // const { groups } = useUser();
  <Layout className={styles.layout}>
    <Sidebar /*filters={{}}*/ />
    <ScrollView className={styles.scrollContent}>
      <PageContent title={'Kids First Variants'}>
        <VariantPageContainer></VariantPageContainer>
      </PageContent>
    </ScrollView>
  </Layout>
);
export default VariantPage;
