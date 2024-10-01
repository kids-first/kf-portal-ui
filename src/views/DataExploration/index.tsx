import { useCallback, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  ExperimentOutlined,
  FileSearchOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  IFilter,
  IFilterGroup,
  TExtendedMapping,
  VisualType,
} from '@ferlab/ui/core/components/filters/types';
import useQueryBuilderState, {
  updateActiveQueryField,
  updateActiveQueryFilters,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import SidebarMenu, { ISidebarMenuItem } from '@ferlab/ui/core/components/SidebarMenu';
import {
  CheckboxQFOption,
  FacetOption,
  TitleQFOption,
} from '@ferlab/ui/core/components/SidebarMenu/QuickFilter';
import { underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import { getFilterGroup, getFilterType } from '@ferlab/ui/core/data/filters/utils';
import { TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { MERGE_VALUES_STRATEGIES } from '@ferlab/ui/core/data/sqon/types';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import { IExtendedMappingResults, TAggregationBuckets } from '@ferlab/ui/core/graphql/types';
import ScrollContent from '@ferlab/ui/core/layout/ScrollContent';
import { removeUnderscoreAndCapitalize, titleCase } from '@ferlab/ui/core/utils/stringUtils';
import { INDEXES } from 'graphql/constants';
import { GET_QUICK_FILTER_EXPLO } from 'graphql/quickFilter/queries';
import { getFilters } from 'graphql/utils/Filters';
import { capitalize, get } from 'lodash';
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
import { ArrangerApi } from 'services/api/arranger';
import { remoteSliceActions } from 'store/remote/slice';
import { RemoteComponentList } from 'store/remote/types';
import {
  mapFilterForBiospecimen,
  mapFilterForFiles,
  mapFilterForParticipant,
} from 'utils/fieldMapper';
import {
  getFacetsDictionary,
  getFiltersDictionary,
  getQueryBuilderDictionary,
} from 'utils/translation';

import { AGGREGATION_QUERY } from '../../graphql/queries';

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
import {
  getFieldWithoutPrefix,
  getIndexFromQFValueFacet,
  getSelectedOptionsByQuery,
  getSqonForQuickFilterFacetValue,
  getSqonForQuickFilterFacetView,
} from './utils/quickFilter';

import styles from './index.module.css';

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
          <TreeFacet key="mondo" type={RemoteComponentList.MondoTree} field={'mondo'} />,
          'diagnosis__ncit_display_term',
          'diagnosis__source_text',
          'family_type',
          <TreeFacet
            key="observed_phenotype"
            type={RemoteComponentList.HPOTree}
            field={'observed_phenotype'}
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
          'collection_ncit_anatomy_site',
          'collection_anatomy_site',
          'consent_type',
          'dbgap_consent_code',
          'diagnoses__mondo_display_term',
          'diagnoses__ncit_display_term',
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
      {
        title: 'Imaging',
        facets: [
          'imaging__modality',
          'imaging_sequence_type',
          'imaging_technique',
          'imaging__info_body_part_examined',
          'imaging__device__magnetic_field_strength',
          'imaging__device__manufacturer',
          'imaging__device__model_name',
        ],
      },
    ],
  },
};

const DataExploration = () => {
  const dispatch = useDispatch();
  const { tab } = useParams<{ tab: string }>();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const participantMappingResults = useGetExtendedMappings(INDEXES.PARTICIPANT);
  const fileMappingResults = useGetExtendedMappings(INDEXES.FILE);
  const biospecimenMappingResults = useGetExtendedMappings(INDEXES.BIOSPECIMEN);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quickFilterData, setQuickFilterData] = useState<{ participant: { aggregations: any } }>();
  const [forceClose, setForceClose] = useState<boolean>(false);

  const quickfilterOpenRemote = (field: string): boolean => {
    if (field === 'observed_phenotype__name') {
      dispatch(
        remoteSliceActions.openRemoteComponent({
          id: RemoteComponentList.HPOTree,
          props: {
            visible: true,
          },
        }),
      );
      return true;
    }
    if (field === 'mondo__name') {
      dispatch(
        remoteSliceActions.openRemoteComponent({
          id: RemoteComponentList.MondoTree,
          props: {
            visible: true,
          },
        }),
      );

      return true;
    }

    return false;
  };

  const fetchFacets = useCallback(async () => {
    const { data } = await ArrangerApi.graphqlRequest<{
      data: { participant: { aggregations: any } };
    }>({
      query: GET_QUICK_FILTER_EXPLO.loc?.source.body,
      variables: {
        sqon: getSqonForQuickFilterFacetValue(activeQuery),
      },
    });
    if (data) setQuickFilterData(data?.data);
  }, [JSON.stringify(activeQuery)]);

  useEffect(() => {
    fetchFacets();
  }, [fetchFacets]);

  const getMappingByIndex = (index: string): IExtendedMappingResults => {
    switch (index) {
      case INDEXES.BIOSPECIMEN:
        return biospecimenMappingResults;
      case INDEXES.FILE:
        return fileMappingResults;
      case INDEXES.PARTICIPANT:
      default:
        return participantMappingResults;
    }
  };

  const getQFSuggestions = async (
    searchText: string,
    setOptions: React.Dispatch<React.SetStateAction<(TitleQFOption | CheckboxQFOption)[]>>,
    setTotal: React.Dispatch<React.SetStateAction<number>>,
    setSelectedOptions: React.Dispatch<React.SetStateAction<CheckboxQFOption[]>>,
  ) => {
    setIsLoading(true);
    let totalResult = 0;
    const regexp = new RegExp('(?:^|\\W)' + searchText, 'gi');
    const facetDictionary = getFacetsDictionary();
    const suggestions: (TitleQFOption | CheckboxQFOption)[] = [];

    Object.entries(quickFilterData?.participant.aggregations).forEach(([key, value]) => {
      const facetName = get(
        facetDictionary,
        underscoreToDot(getFieldWithoutPrefix(key)),
        removeUnderscoreAndCapitalize(getFieldWithoutPrefix(key)).replace('  ', ' '),
      );
      const facetType = participantMappingResults.data.find(
        (mapping) => mapping.field === underscoreToDot(key),
      )?.type;

      const facetValueMapping =
        getQueryBuilderDictionary(facetName).query?.facetValueMapping?.[underscoreToDot(key)];

      const bucketFiltered: (TitleQFOption | CheckboxQFOption)[] = [];

      (value as TAggregationBuckets)?.buckets?.map((bucket: { key: string; doc_count: number }) => {
        const label = capitalize(facetValueMapping?.[bucket.key]) || titleCase(bucket.key);
        const index = getIndexFromQFValueFacet(key);

        if (regexp.exec(label)) {
          ++totalResult;
          bucketFiltered.push({
            key: bucket.key,
            label,
            docCount: bucket.doc_count,
            type: facetType ? getFilterType(facetType) : VisualType.Checkbox,
            facetKey: key,
            index: index,
          });
        }
      });

      const isFacetNameMatch = regexp.exec(facetName);
      if (isFacetNameMatch || bucketFiltered.length > 0) {
        if (isFacetNameMatch) ++totalResult;

        suggestions.push({
          key: key,
          label: facetName,
          type: 'title',
          index: getIndexFromQFValueFacet(key),
        });
        suggestions.push(...bucketFiltered);
      }
    });

    setSelectedOptions(getSelectedOptionsByQuery(activeQuery));
    setTotal(totalResult);
    setOptions(suggestions);
    setIsLoading(false);
  };

  const handleFacetClick = async (
    setFacetOptions: React.Dispatch<React.SetStateAction<FacetOption | undefined>>,
    option: TitleQFOption,
  ) => {
    setIsLoading(true);

    if (quickfilterOpenRemote(option.key)) {
      setForceClose(true);
      return;
    }

    const { data } = await ArrangerApi.graphqlRequest<{
      data: any;
    }>({
      query: AGGREGATION_QUERY(
        option.index,
        [getFieldWithoutPrefix(option.key)],
        getMappingByIndex(option.index),
      ).loc?.source.body,

      variables: {
        sqon: getSqonForQuickFilterFacetView(activeQuery, option.index),
      },
    });

    const found = (getMappingByIndex(option.index)?.data || []).find(
      (f: TExtendedMapping) => f.field === underscoreToDot(getFieldWithoutPrefix(option.key)),
    );

    const getAgg = () => {
      switch (option.index) {
        case INDEXES.BIOSPECIMEN:
          return data?.data.biospecimen.aggregations[getFieldWithoutPrefix(option.key)];
        case INDEXES.FILE:
          return data?.data.file.aggregations[getFieldWithoutPrefix(option.key)];
        case INDEXES.PARTICIPANT:
        default:
          return data?.data.participant.aggregations[getFieldWithoutPrefix(option.key)];
      }
    };

    const aggregations = getAgg();

    const filterGroup = getFilterGroup({
      extendedMapping: found,
      aggregation: aggregations,
      rangeTypes: [],
      filterFooter: false,
      headerTooltip: false,
      dictionary: getFacetsDictionary(),
      noDataInputOption: false,
    });

    const filters =
      getFilters({ [`${option.key}`]: aggregations as TAggregationBuckets }, option.key) || [];

    const onChange = (fg: IFilterGroup, f: IFilter[]) => {
      updateActiveQueryFilters({
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        filterGroup: fg,
        selectedFilters: f,
        index: getIndexFromQFValueFacet(option.key),
      });
    };

    const selectedFilters = getSelectedFilters({
      queryBuilderId: DATA_EXPLORATION_QB_ID,
      filters,
      filterGroup,
    });

    setFacetOptions({
      filterGroup,
      filters,
      onChange,
      selectedFilters,
    });
    setIsLoading(false);
  };

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

  const addQFOptionsToQB = (options: CheckboxQFOption[], operator: TermOperators) =>
    options.forEach((option: CheckboxQFOption) =>
      updateActiveQueryField({
        queryBuilderId: DATA_EXPLORATION_QB_ID,
        field: underscoreToDot(getFieldWithoutPrefix(option.facetKey)),
        value: [option.key],
        index: option.index,
        merge_strategy: MERGE_VALUES_STRATEGIES.APPEND_VALUES,
        operator,
      }),
    );

  return (
    <div className={styles.dataExplorationLayout}>
      <TreeFacetModal
        key="observed_phenotype_hpo"
        type={RemoteComponentList.HPOTree}
        field={'observed_phenotype'}
      />

      <TreeFacetModal
        key="observed_phenotype_mondo"
        type={RemoteComponentList.MondoTree}
        field={'mondo'}
      />
      <SidebarMenu
        className={styles.sideMenu}
        menuItems={menuItems} /* defaultSelectedKey={tab} */
        quickFilter={{
          dictionary: getFiltersDictionary(),
          handleFacetClick,
          getSuggestionsList: getQFSuggestions,
          handleOnApply: addQFOptionsToQB,
          enableQuickFilter: true,
          inputSuffixIcon: <SearchOutlined />,
          isLoading,
          forceClose,
          handleClear: () => setForceClose(false),
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
