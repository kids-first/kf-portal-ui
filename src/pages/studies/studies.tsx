import React from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import { Layout } from 'antd';

import PageContent from 'components/Layout/PageContent';
import { useGetStudiesPageData } from 'store/graphql/studies/actions';
import { useGetExtendedMappings } from 'store/graphql/utils/actions';

import Sidebar from './Sidebar';
import StudyPageContainer from './StudyPageContainer';

import styles from './studies.module.scss';

export const MAX_NUMBER_STUDIES = 1000;

const Studies = () => {
  const { filters } = useFilters();
  const allSqons = getQueryBuilderCache('study-repo').state;

  let studiesResults = useGetStudiesPageData({
    sqon: resolveSyntheticSqon(allSqons, filters),
    first: MAX_NUMBER_STUDIES,
    offset: 0,
  });

  let studiesMappingResults = useGetExtendedMappings('studies');

  return (
    <Layout className={styles.layout}>
      <Sidebar
        studiesMappingResults={studiesMappingResults}
        studiesResults={studiesResults}
        filters={filters}
      />
      <ScrollView className={styles.scrollContent}>
        <PageContent title="Studies">
          <StudyPageContainer
            studiesResults={studiesResults}
            studiesMappingResults={studiesMappingResults}
            filters={filters}
          />
        </PageContent>
      </ScrollView>
    </Layout>
  );
};

export default Studies;
