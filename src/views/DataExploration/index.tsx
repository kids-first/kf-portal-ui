import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import { FileSearchOutlined, UserOutlined } from '@ant-design/icons';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { Spin } from 'antd';
import { INDEXES } from 'graphql/constants';
import { ExtendedMappingResults } from 'graphql/models';
import PageContent from 'views/DataExploration/components/PageContent';
import {
  DATA_EXPLORATION_QB_ID,
  SCROLL_WRAPPER_ID,
  TAB_IDS,
} from 'views/DataExploration/utils/constant';

import FilterList, { TCustomFilterMapper } from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { mapFilterForFiles, mapFilterForParticipant } from 'utils/fieldMapper';

import FileSearch from './components/FileSearch';
import FileSetSearch from './components/FileSetSearch';
import ParticipantSearch from './components/ParticipantSearch';
import ParticipantSetSearch from './components/ParticipantSetSearch';
import TreeFacet from './components/TreeFacet';
import { formatHpoTitleAndCode, formatMondoTitleAndCode } from './utils/helper';

import styles from './index.module.scss';

enum FilterTypes {
  Participant,
  Biospecimen,
  Datafiles,
}

const filterGroups: {
  [type: string]: FilterInfo;
} = {
  [FilterTypes.Participant]: {
    customSearches: [
      <ParticipantSearch key={0} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <ParticipantSetSearch key={1} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
    ],
    groups: [
      {
        facets: [
          'internal_donor_id',
          <TreeFacet
            type={'mondoTree'}
            field={'mondo'}
            titleFormatter={formatMondoTitleAndCode}
            key={'mondo'}
          />,
          <TreeFacet
            type={'hpoTree'}
            field={'observed_phenotype'}
            titleFormatter={formatHpoTitleAndCode}
            key={'observed_phenotype'}
          />,
          'gender',
          'ethnicity',
          'is_a_proband',
          'age_of_death',
        ],
      },
    ],
  },
  [FilterTypes.Datafiles]: {
    customSearches: [
      <FileSearch key={0} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <FileSetSearch key={1} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
    ],
    groups: [
      {
        facets: [
          'data_access',
          'data_category',
          'data_type',
          'file_format',
          'internal_file_id',
          'platform',
          'experimental_strategy',
          'is_harmonized',
        ],
      },
    ],
  },
};

const DataExploration = () => {
  const { tab } = useParams<{ tab: string }>();
  const participantMappingResults = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const fileMappingResults = useGetExtendedMappings(INDEXES.FILE);

  const menuItems: ISidebarMenuItem[] = [
    {
      key: TAB_IDS.PARTICIPANTS,
      title: intl.get('screen.dataExploration.sidemenu.participant'),
      icon: <UserOutlined className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          key={INDEXES.PARTICIPANT}
          index={INDEXES.PARTICIPANT}
          queryBuilderId={DATA_EXPLORATION_QB_ID}
          extendedMappingResults={participantMappingResults}
          filterInfo={filterGroups[FilterTypes.Participant]}
          filterMapper={mapFilterForParticipant}
        />
      ),
    },
    {
      key: TAB_IDS.DATA_FILES,
      title: intl.get('screen.dataExploration.sidemenu.datafiles'),
      icon: <FileSearchOutlined className={styles.sideMenuIcon} />,
      panelContent: (
        <FilterList
          key={INDEXES.FILE}
          index={INDEXES.FILE}
          queryBuilderId={DATA_EXPLORATION_QB_ID}
          extendedMappingResults={fileMappingResults}
          filterInfo={filterGroups[FilterTypes.Datafiles]}
          filterMapper={mapFilterForFiles}
        />
      ),
    },
  ];

  return (
    <div className={styles.dataExplorationLayout}>
      <SidebarMenu className={styles.sideMenu} menuItems={menuItems} defaultSelectedKey={tab} />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent
          fileMapping={fileMappingResults}
          participantMapping={participantMappingResults}
          tabId={tab}
        />
      </ScrollContent>
    </div>
  );
};

export default DataExploration;
