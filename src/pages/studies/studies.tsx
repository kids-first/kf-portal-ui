import React, { useState } from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import { Layout } from 'antd';

import PageContent from 'components/Layout/PageContent';
import { useGetExtendedMappings, useGetStudiesPageData } from 'store/graphql/studies/actions';

import Sidebar from './Sidebar';
import StudyPageContainer from './StudyPageContainer';
import { useFilters } from './utils';

import styles from './studies.module.scss';

let previousData: any | null = null;
let previousMappingData: any | null = null;
const studiesPerPage = 10;

const Studies = () => {
  const { filters } = useFilters();
  const [currentPage, setCurrentPage] = useState(1);

  let studiesResults = useGetStudiesPageData({
    sqon: filters,
    first: studiesPerPage,
    offset: (currentPage - 1) * studiesPerPage,
  });

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
      <Sidebar
        studiesMappingResults={studiesMappingResults}
        studiesResults={studiesResults}
        onChange={() => setCurrentPage(1)}
      />
      <ScrollView className={styles.scrollContent}>
        <PageContent title="Studies">
          <StudyPageContainer
            studiesResults={studiesResults}
            studiesMappingResults={studiesMappingResults}
            filters={filters}
            pagination={{
              current: currentPage,
              pageSize: studiesPerPage,
              total: studiesResults.data?.hits.total || 0,
              onChange: (page: number) => {
                setCurrentPage(page);
              },
            }}
          />
        </PageContent>
      </ScrollView>
    </Layout>
  );
};

export default Studies;
