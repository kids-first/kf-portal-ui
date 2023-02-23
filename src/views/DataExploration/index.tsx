import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import {
  FileSearchOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';
import PageContent from 'views/DataExploration/components/PageContent';
import TreeFacet from 'views/DataExploration/components/TreeFacet';
import {
  DATA_EXPLORATION_QB_ID,
  SCROLL_WRAPPER_ID,
  TAB_IDS,
} from 'views/DataExploration/utils/constant';

import FilterList from 'components/uiKit/FilterList';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import useGetExtendedMappings from 'hooks/graphql/useGetExtendedMappings';
import { RemoteComponentList } from 'store/remote/types';
import { mapFilterForFiles, mapFilterForParticipant } from 'utils/fieldMapper';

import { BiospecimenCollectionSearch, BiospecimenSearch } from './components/BiospecimenSearch';
import BiospecimenSetSearch from './components/BiospecimenSetSearch';
import FileSearch from './components/FileSearch';
import FileSetSearch from './components/FileSetSearch';
import ParticipantSearch from './components/ParticipantSearch';
import ParticipantSetSearch from './components/ParticipantSetSearch';
import TreeFacetModal from './components/TreeFacet/TreeFacetModal';
import BiospecimenUploadIds from './components/UploadIds/BiospecimenUploadIds';
import FileUploadIds from './components/UploadIds/FileUploadIds';
import ParticipantUploadIds from './components/UploadIds/ParticipantUploadIds';
import { formatHpoTitleAndCode, formatMondoTitleAndCode } from './utils/helper';

import styles from './index.module.scss';

enum FilterTypes {
  Study,
  Participant,
  Clinical,
  Biospecimen,
  Datafiles,
}

const filterGroups: {
  [type: string]: FilterInfo;
} = {
  [FilterTypes.Study]: {
    groups: [
      {
        facets: ['study__study_name', 'study__study_code', 'study__program', 'study__external_id'],
      },
    ],
  },
  [FilterTypes.Participant]: {
    customSearches: [
      <ParticipantSearch key={0} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <ParticipantSetSearch key={1} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <ParticipantUploadIds key={2} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
    ],
    groups: [
      {
        facets: ['is_proband', 'ethnicity', 'sex', 'race'],
      },
    ],
  },
  [FilterTypes.Clinical]: {
    groups: [
      {
        facets: [
          'diagnosis__affected_status',
          'diagnosis__age_at_event_days',
          'outcomes__age_at_event_days__value',
          'phenotype__age_at_event_days',
          <TreeFacet
            type={RemoteComponentList.MondoTree}
            field={'mondo'}
            titleFormatter={formatMondoTitleAndCode}
          />,
          'diagnosis__ncit_id_diagnosis',
          'diagnosis__source_text',
          <TreeFacet
            type={RemoteComponentList.HPOTree}
            field={'observed_phenotype'}
            titleFormatter={formatHpoTitleAndCode}
          />,
          'phenotype__hpo_phenotype_not_observed',
          'diagnosis__source_text_tumor_location',
          'outcomes__vital_status',
        ],
      },
    ],
  },
  [FilterTypes.Biospecimen]: {
    customSearches: [
      <BiospecimenSearch key={0} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <BiospecimenCollectionSearch key={1} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <BiospecimenSetSearch key={2} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <BiospecimenUploadIds key={3} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
    ],
    groups: [
      {
        facets: [
          'sample_type', // Incorrect: just a placeholder
        ],
      },
    ],
  },
  [FilterTypes.Datafiles]: {
    customSearches: [
      <FileSearch key={0} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <FileSetSearch key={1} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
      <FileUploadIds key={2} queryBuilderId={DATA_EXPLORATION_QB_ID} />,
    ],
    groups: [
      {
        facets: [
          'data_category',
          'data_type',
          'sequencing_experiment__experiment_strategy',
          'file_format',
          'is_harmonized',
          'repository',
          'controlled_access',
          'acl',
        ],
      },
    ],
  },
};

const DataExploration = () => {
  const { tab } = useParams<{ tab: string }>();
  const participantMappingResults = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const fileMappingResults = useGetExtendedMappings(INDEXES.FILES);
  //FIXME const biospecimenMappingResults = useGetExtendedMappings(INDEXES.BIOSPECIMEN);

  const menuItems: ISidebarMenuItem[] = [
    {
      key: 'study',
      title: intl.get('screen.dataExploration.sidemenu.study'),
      icon: <ReadOutlined />,
      panelContent: (
        <FilterList
          key={INDEXES.STUDIES}
          index={INDEXES.PARTICIPANT}
          queryBuilderId={DATA_EXPLORATION_QB_ID}
          extendedMappingResults={participantMappingResults}
          filterInfo={filterGroups[FilterTypes.Study]}
          filterMapper={mapFilterForParticipant}
        />
      ),
    },
    {
      key: TAB_IDS.PARTICIPANTS,
      title: intl.get('screen.dataExploration.sidemenu.participant'),
      icon: <UserOutlined />,
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
      key: 'clinical',
      title: intl.get('screen.dataExploration.sidemenu.clinical'),
      icon: <MedicineBoxOutlined />,
      panelContent: (
        <FilterList
          key={INDEXES.CLINICAL}
          index={INDEXES.PARTICIPANT}
          queryBuilderId={DATA_EXPLORATION_QB_ID}
          extendedMappingResults={participantMappingResults}
          filterInfo={filterGroups[FilterTypes.Clinical]}
          filterMapper={mapFilterForParticipant}
        />
      ),
    },
    /*
    FIXME: to complete when data is complete.
    {
      key: TAB_IDS.BIOSPECIMENS,
      title: intl.get('screen.dataExploration.sidemenu.biospecimen'),
      icon: <ExperimentOutlined />,
      panelContent: (
        <FilterList
          key={INDEXES.BIOSPECIMEN}
          index={INDEXES.BIOSPECIMEN}
          queryBuilderId={DATA_EXPLORATION_QB_ID}
          extendedMappingResults={biospecimenMappingResults}
          filterInfo={filterGroups[FilterTypes.Biospecimen]}
          filterMapper={mapFilterForBiospecimen}
        />
      ),
    },
*/
    {
      key: TAB_IDS.DATA_FILES,
      title: intl.get('screen.dataExploration.sidemenu.datafiles'),
      icon: <FileSearchOutlined />,
      panelContent: (
        <FilterList
          key={INDEXES.FILES}
          index={INDEXES.FILES}
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
      <TreeFacetModal
        type={RemoteComponentList.MondoTree}
        modalField={'mondo'}
        queryBuilderField={'mondo.name'}
        titleFormatter={formatMondoTitleAndCode}
      />
      <TreeFacetModal
        type={RemoteComponentList.HPOTree}
        modalField={'observed_phenotype'}
        queryBuilderField={'phenotype.hpo_phenotype_observed'}
        titleFormatter={formatHpoTitleAndCode}
      />
      <SidebarMenu
        className={styles.sideMenu}
        menuItems={menuItems} /* defaultSelectedKey={tab} */
      />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent
          fileMapping={fileMappingResults}
          //TODO biospecimenMapping={biospecimenMappingResults}
          participantMapping={participantMappingResults}
          tabId={tab}
        />
      </ScrollContent>
    </div>
  );
};

export default DataExploration;
