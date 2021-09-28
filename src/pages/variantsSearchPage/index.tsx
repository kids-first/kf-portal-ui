import React, { ReactNode, useState } from 'react';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/sidebarMenu';
import ScrollView from '@ferlab/ui/core/layout/ScrollView';
import { Button, Layout, Modal, Typography } from 'antd';

import PageContent from 'components/Layout/PageContent';
import DiseaseIcon from 'icons/DiseaseIcon';
import FrequencyIcon from 'icons/FrequencyIcon';
import GeneIcon from 'icons/GeneIcon';
import LineStyleIcon from 'icons/LineStyleIcon';
import OccurenceIcon from 'icons/OccurenceIcon';
import OpenInNewIcon from 'icons/OpenInNewIcon';
import { MappingResults, useGetExtendedMappings } from 'store/graphql/utils/actions';

import FrequencyFilters from './filters/FrequencyFilters';
import GeneFilters from './filters/GeneFilters';
import OccurenceFilters from './filters/OccurenceFilters';
import PathogenicityFilters from './filters/PathogenicityFilters';
import VariantFilters from './filters/VariantFilters';
import VariantPageContainer from './VariantPageContainer';
import VariantStats from './VariantStats';

import styles from './VariantsSearchPage.module.scss';

const { Title } = Typography;

const filtersContainer = (mappingResults: MappingResults, type: string): ReactNode => {
  switch (type) {
    case 'Variant':
      return <VariantFilters mappingResults={mappingResults} />;
    case 'Gene':
      return <GeneFilters mappingResults={mappingResults} />;
    case 'Pathogenicity':
      return <PathogenicityFilters mappingResults={mappingResults} />;
    case 'Frequency':
      return <FrequencyFilters mappingResults={mappingResults} />;
    case 'Occurence':
      return <OccurenceFilters mappingResults={mappingResults} />;
    default:
      return <div />;
  }
};

const VariantPage = () => {
  const [statsModalOpened, setStatsModalOpened] = useState(false);
  const variantMappingResults = useGetExtendedMappings('variants');

  const menuItems: ISidebarMenuItem[] = [
    {
      key: '1',
      title: 'Variant',
      icon: <LineStyleIcon />,
      panelContent: filtersContainer(variantMappingResults, 'Variant'),
    },
    {
      key: '2',
      title: 'Gene',
      icon: <GeneIcon />,
      panelContent: filtersContainer(variantMappingResults, 'Gene'),
    },
    {
      key: '3',
      title: 'Pathogenicity',
      icon: <DiseaseIcon />,
      panelContent: filtersContainer(variantMappingResults, 'Pathogenicity'),
    },
    {
      key: '4',
      title: 'Frequency',
      icon: <FrequencyIcon />,
      panelContent: filtersContainer(variantMappingResults, 'Frequency'),
    },
    {
      key: '5',
      title: 'Occurence',
      icon: <OccurenceIcon />,
      panelContent: filtersContainer(variantMappingResults, 'Occurence'),
    },
  ];

  return (
    <Layout className={styles.layout}>
      <SidebarMenu menuItems={menuItems} />
      <ScrollView className={styles.scrollContent}>
        <PageContent
          title={
            <div className={styles.pageHeader}>
              <Title className={styles.pageHeaderTitle} level={1}>
                Variants Exploration
              </Title>
              <a className={styles.dataReleaseTag} onClick={() => setStatsModalOpened(true)}>
                <span>Data release 1.0</span>
                <OpenInNewIcon fill="#007694" width="12" />
              </a>
            </div>
          }
        >
          <VariantPageContainer mappingResults={variantMappingResults} />
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
            OK
          </Button>,
        ]}
      >
        <VariantStats />
      </Modal>
    </Layout>
  );
};
export default VariantPage;
