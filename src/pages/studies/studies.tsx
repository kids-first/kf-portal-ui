/* eslint-disable react/display-name */
import React, { FC } from 'react';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';

import PageContent from 'components/Layout/PageContent';
import Sidebar from './Sidebar';
import StudyPageContainer from './StudyPageContainer';
import { useGetExtendedMappings, useGetStudiesPageData } from '../../store/graphql/studies/actions';
import { useFilters } from './utils';
import { Layout } from 'antd';

import styles from './studies.module.scss';

const Studies: FC = () => {
const { filters } = useFilters();
const { loading: loadingData, results: data } = useGetStudiesPageData({ sqon: filters });
const { loading: mappingLoading, results: studyMapping } = useGetExtendedMappings('study');

return (<Layout className={styles.layout}>
    <Sidebar />
    <ScrollView className={styles.scrollContent}>
      <PageContent title="Studies">
        <StudyPageContainer />
      </PageContent>
    </ScrollView>
  </Layout>
)};

export default Studies;
