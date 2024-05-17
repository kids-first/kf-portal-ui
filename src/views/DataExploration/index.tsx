import { useState } from 'react';
import intl from 'react-intl-universal';
import { useParams } from 'react-router-dom';
import {
  ExperimentOutlined,
  FileSearchOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import {
  TitleQFOption,
  CheckboxQFOption,
  QuickFilterType,
} from '@ferlab/ui/core/components/SidebarMenu/QuickFilter';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { TAggregationBuckets } from '@ferlab/ui/core/graphql/types';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { INDEXES } from 'graphql/constants';
import { GET_QUICK_FILTER_EXPLO } from 'graphql/quickFilter/queries';
import { getFTEnvVarByKey } from 'helpers/EnvVariables';
import { ArrangerApi } from 'services/api/arranger';
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
import {
  mapFilterForBiospecimen,
  mapFilterForFiles,
  mapFilterForParticipant,
} from 'utils/fieldMapper';

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
import { capitalize, get } from 'lodash';
import { getFacetsDictionary, getQueryBuilderDictionary } from 'utils/translation';
import { underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import { removeUnderscoreAndCapitalize } from '@ferlab/ui/core/utils/stringUtils';

const FT_QUICK_FILTER_KEY = 'QUICK_FILTER';

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
        facets: [
          'study__study_name',
          'study__study_code',
          'study__program',
          'study__domain',
          'study__external_id',
        ],
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
          'diagnosis__age_at_event_days',
          'outcomes__age_at_event_days__value',
          'phenotype__age_at_event_days',
          <TreeFacet
            key="mondo-tree"
            type={RemoteComponentList.MondoTree}
            field={'mondo'}
            titleFormatter={formatMondoTitleAndCode}
          />,
          'diagnosis__ncit_id_diagnosis',
          'diagnosis__source_text',
          'family_type',
          <TreeFacet
            key="observed-phoenotype-tree"
            type={RemoteComponentList.HPOTree}
            field={'observed_phenotype'}
            titleFormatter={formatHpoTitleAndCode}
          />,
          'phenotype__hpo_phenotype_not_observed',
          'phenotype__source_text',
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
          'sample_type',
          'collection_sample_type',
          'age_at_biospecimen_collection',
          'diagnoses__age_at_event__value',
          'status',
          'collection_ncit_anatomy_site_id',
          'collection_anatomy_site',
          'consent_type',
          'dbgap_consent_code',
          'diagnoses__mondo_display_term',
          'diagnoses__diagnosis_ncit',
          'diagnoses__source_text',
          'diagnoses__source_text_tumor_location',
          'collection_method_of_sample_procurement',
          'diagnoses__source_text_tumor_descriptor',
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
          'controlled_access',
          'data_category',
          'data_type',
          'sequencing_experiment__experiment_strategy',
          'file_format',
          'sequencing_experiment__platform',
          'sequencing_experiment__instrument_model',
          'sequencing_experiment__library_strand',
          'sequencing_experiment__is_paired_end',
          'repository',
          'acl',
        ],
      },
    ],
  },
};

const getQFSuggestions = async (
  setOptions: React.Dispatch<React.SetStateAction<(TitleQFOption | CheckboxQFOption)[]>>,
  sqon: ISyntheticSqon,
  searchText: string,
) => {
  // console.log('search text', searchText);
  const { data } = await ArrangerApi.graphqlRequest<{
    data: { participant: { aggregations: any } };
  }>({
    query: GET_QUICK_FILTER_EXPLO.loc?.source.body,
    variables: {
      sqon: sqon,
    },
  });

  const facetDictionary = getFacetsDictionary();
  const suggestions: (TitleQFOption | CheckboxQFOption)[] = [];
  Object.entries(data?.data.participant.aggregations).forEach(([key, value]) => {
    const facetName = get(
      facetDictionary,
      underscoreToDot(getFieldWithoutPrefix(key)),
      removeUnderscoreAndCapitalize(getFieldWithoutPrefix(key)).replace('  ', ' '),
    );

    const facetValueMapping = getQueryBuilderDictionary(facetName).query?.facetValueMapping?.[key];
    console.log('facetValueMapping', facetValueMapping);

    // si buckets length ou si match avec value
    suggestions.push({ key: key, title: facetName, type: QuickFilterType.TITLE });
    (value as TAggregationBuckets)?.buckets?.map((bucket: { key: string; doc_count: number }) =>
      suggestions.push({
        key: bucket.key,
        docCount: bucket.doc_count,
        type: QuickFilterType.CHECKBOX,
        facetKey: key,
        index: getIndexFromQFValueFacet(key),
      }),
    );
  });
  // console.log('suggestions', suggestions);
  setOptions(suggestions);
};

const getIndexFromQFValueFacet = (facetKey: string): INDEXES => {
  if (facetKey.startsWith('files__biospecimens__')) return INDEXES.BIOSPECIMEN;
  else if (facetKey.startsWith('files__')) return INDEXES.FILE;
  else return INDEXES.PARTICIPANT;
};

const getFieldWithoutPrefix = (facetKey: string): string => {
  if (facetKey.startsWith('files__biospecimens__')) return facetKey.slice(21);
  else if (facetKey.startsWith('files__')) return facetKey.slice(7);
  else return facetKey;
};

const DataExploration = () => {
  const { tab } = useParams<{ tab: string }>();
  const participantMappingResults = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const fileMappingResults = useGetExtendedMappings(INDEXES.FILE);
  const biospecimenMappingResults = useGetExtendedMappings(INDEXES.BIOSPECIMEN);

  const enableQuickFilter = getFTEnvVarByKey(FT_QUICK_FILTER_KEY);

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
    {
      key: TAB_IDS.DATA_FILES,
      title: intl.get('screen.dataExploration.sidemenu.datafiles'),
      icon: <FileSearchOutlined />,
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
      <TreeFacetModal
        type={RemoteComponentList.MondoTree}
        modalField={'mondo'}
        queryBuilderField={'mondo.name'}
        titleFormatter={formatMondoTitleAndCode}
      />
      <TreeFacetModal
        type={RemoteComponentList.HPOTree}
        modalField={'observed_phenotype'}
        queryBuilderField={'observed_phenotype.name'}
        titleFormatter={formatHpoTitleAndCode}
      />
      <SidebarMenu
        className={styles.sideMenu}
        menuItems={menuItems} /* defaultSelectedKey={tab} */
        quickFilter={{
          enableQuickFilter: enableQuickFilter === 'true',
          getSuggestionsList: getQFSuggestions,
          inputSuffixIcon: <SearchOutlined />,
          menuTitle: intl.get('global.quickFilter.menuTitle'),
          placeholder: intl.get('global.quickFilter.placeholder'),
          queryBuilderId: DATA_EXPLORATION_QB_ID,
        }}
      />
      <ScrollContent id={SCROLL_WRAPPER_ID} className={styles.scrollContent}>
        <PageContent
          fileMapping={fileMappingResults}
          biospecimenMapping={biospecimenMappingResults}
          participantMapping={participantMappingResults}
          tabId={tab}
          filterGroups={filterGroups}
        />
      </ScrollContent>
    </div>
  );
};

export default DataExploration;
