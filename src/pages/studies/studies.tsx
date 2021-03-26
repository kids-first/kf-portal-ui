import React, { FC } from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';

import PageContent from 'components/Layout/PageContent';
import Sidebar from './Sidebar';
import StudyPageContainer from './StudyPageContainer';
import { useGetExtendedMappings, useGetStudiesPageData } from 'store/graphql/studies/actions';
import { useFilters } from './utils';
import { Layout } from 'antd';

import styles from './studies.module.scss';

let previousData: any | null = null;
let previousMappingData: any | null = null;

const Studies: FC = () => {
  const { filters } = useFilters();
  let studiesResults = useGetStudiesPageData({ sqon: filters });
  let studiesMappingResults = useGetExtendedMappings('studies');

  if (studiesResults.loading || studiesMappingResults.loadingMapping) {
    if (!studiesResults.data && previousData) {
      studiesResults = previousData;
    }

    if (!studiesMappingResults.extendedMapping && previousMappingData) {
      studiesMappingResults = previousMappingData;
    }
  }

  if (studiesResults.data) {
    previousData = studiesResults;
  }
  if (studiesMappingResults) {
    previousMappingData = studiesMappingResults;
  }

  return (
    <Layout className={styles.layout}>
      <Sidebar studiesMappingResults={studiesMappingResults} studiesResults={studiesResults} />
      <ScrollView className={styles.scrollContent}>
        <PageContent title="Studies">
          <StudyPageContainer studiesResults={studiesResults} filters={filters} />
        </PageContent>
      </ScrollView>
    </Layout>
  );
};

export default Studies;
