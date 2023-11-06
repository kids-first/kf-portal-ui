// TODO: Split into smaller files/components
import { ReactElement, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  ExperimentOutlined,
  FileTextOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { dotToUnderscore } from '@ferlab/ui/core/data/arranger/formatting';
import { IRemoteComponent, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { isEmptySqon, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { Space, Tabs, Typography } from 'antd';
import copy from 'copy-to-clipboard';
import { useTotalBiospecimens } from 'graphql/biospecimens/actions';
import { INDEXES } from 'graphql/constants';
import { useTotalDataFiles } from 'graphql/files/actions';
import { useTotalParticipants } from 'graphql/participants/actions';
import { IParticipantResultTree } from 'graphql/participants/models';
import { GET_PARTICIPANT_COUNT } from 'graphql/participants/queries';
import DataFilesTabs from 'views/DataExploration/components/PageContent/tabs/DataFiles';
import ParticipantsTab from 'views/DataExploration/components/PageContent/tabs/Participants';
import SummaryTab from 'views/DataExploration/components/PageContent/tabs/Summary';
import { DATA_EXPLORATION_QB_ID, TAB_IDS } from 'views/DataExploration/utils/constant';

import { SHARED_FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import GenericFilters from 'components/uiKit/FilterList/GenericFilters';
import useQBStateWithSavedFilters from 'hooks/useQBStateWithSavedFilters';
import { ArrangerApi } from 'services/api/arranger';
import { SavedFilterTag } from 'services/api/savedFilter/models';
import { globalActions } from 'store/global';
import { remoteSliceActions } from 'store/remote/slice';
import {
  createSavedFilter,
  deleteSavedFilter,
  setSavedFilterAsDefault,
  updateSavedFilter,
} from 'store/savedFilter/thunks';
import { useSavedSet } from 'store/savedSet';
import {
  combineExtendedMappings,
  mapFilterForBiospecimen,
  mapFilterForFiles,
  mapFilterForParticipant,
} from 'utils/fieldMapper';
import { getCurrentUrl } from 'utils/helper';
import { STATIC_ROUTES } from 'utils/routes';
import { numberWithCommas } from 'utils/string';
import { getQueryBuilderDictionary } from 'utils/translation';

import BioSpecimenTab from './tabs/Biospecimens';

import styles from './index.module.scss';

const { Title } = Typography;

export const MAX_TITLE_LENGTH = 200;
type OwnProps = {
  fileMapping: IExtendedMappingResults;
  biospecimenMapping: IExtendedMappingResults;
  participantMapping: IExtendedMappingResults;
  tabId?: string;
};

const addTagToFilter = (filter: ISavedFilter) => ({
  ...filter,
  tag: SavedFilterTag.ParticipantsExplorationPage,
});

const resolveSqonForParticipants = (queryList: ISyntheticSqon[], activeQuery: ISyntheticSqon) =>
  mapFilterForParticipant(resolveSyntheticSqon(queryList, activeQuery));

const resolveSqonForBiospecimens = (queryList: ISyntheticSqon[], activeQuery: ISyntheticSqon) =>
  mapFilterForBiospecimen(resolveSyntheticSqon(queryList, activeQuery));

const resolveSqonForFiles = (queryList: ISyntheticSqon[], activeQuery: ISyntheticSqon) =>
  mapFilterForFiles(resolveSyntheticSqon(queryList, activeQuery));

const PageContent = ({
  fileMapping,
  biospecimenMapping,
  participantMapping,
  tabId = TAB_IDS.SUMMARY,
}: OwnProps) => {
  const dispatch = useDispatch<any>();
  const history = useHistory();
  const { savedSets } = useSavedSet();
  const { queryList, activeQuery, selectedSavedFilter, savedFilterList } =
    useQBStateWithSavedFilters(DATA_EXPLORATION_QB_ID, SavedFilterTag.ParticipantsExplorationPage);

  const [selectedFilterContent, setSelectedFilterContent] = useState<ReactElement | undefined>(
    undefined,
  );

  const participantResolvedSqon = resolveSqonForParticipants(queryList, activeQuery);
  const biospecimenResolvedSqon = resolveSqonForBiospecimens(queryList, activeQuery);
  const fileResolvedSqon = resolveSqonForFiles(queryList, activeQuery);

  const facetTransResolver = (key: string) => {
    const title = intl.get(`facets.${key}`);
    return title
      ? title
      : combineExtendedMappings([participantMapping, fileMapping, biospecimenMapping])?.data?.find(
          (mapping: TExtendedMapping) => key === mapping.field,
        )?.displayName || key;
  };

  const getSqonAndMappingByIndex = (index: INDEXES) => {
    if (index === INDEXES.FILE) {
      return {
        sqon: fileResolvedSqon,
        mapping: fileMapping,
      };
    }

    if (index === INDEXES.BIOSPECIMEN) {
      return {
        sqon: biospecimenResolvedSqon,
        mapping: biospecimenMapping,
      };
    }

    return {
      sqon: participantResolvedSqon,
      mapping: participantMapping,
    };
  };

  const handleOnUpdateFilter = (filter: ISavedFilter) => dispatch(updateSavedFilter(filter));
  const handleOnSaveFilter = (filter: ISavedFilter) =>
    dispatch(createSavedFilter(addTagToFilter(filter)));
  const handleOnDeleteFilter = (id: string) => dispatch(deleteSavedFilter(id));
  const handleOnSaveAsFavorite = (filter: ISavedFilter) =>
    dispatch(setSavedFilterAsDefault(addTagToFilter(filter)));
  const handleOnShareFilter = (filter: ISavedFilter) => {
    copy(`${getCurrentUrl()}?${SHARED_FILTER_ID_QUERY_PARAM_KEY}=${filter.id}`);
    dispatch(
      globalActions.displayMessage({
        content: 'Copied share url',
        type: 'success',
      }),
    );
  };

  return (
    <Space direction="vertical" size={24} className={styles.dataExplorePageContent}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.dataExploration.title')}
      </Title>
      <QueryBuilder
        id={DATA_EXPLORATION_QB_ID}
        className="data-exploration-repo__query-builder"
        headerConfig={{
          showHeader: true,
          showTools: true,
          defaultTitle: intl.get('components.querybuilder.defaultTitle'),
          options: {
            enableEditTitle: true,
            enableDuplicate: true,
            enableFavoriteFilter: false,
            enableShare: true,
            enableUndoChanges: true,
          },
          selectedSavedFilter: selectedSavedFilter,
          savedFilters: savedFilterList,
          onShareFilter: handleOnShareFilter,
          onUpdateFilter: handleOnUpdateFilter,
          onSaveFilter: handleOnSaveFilter,
          onDeleteFilter: handleOnDeleteFilter,
          onSetAsFavorite: handleOnSaveAsFavorite,
        }}
        facetFilterConfig={{
          enable: true,
          onFacetClick: (filter) => {
            const index = filter.content.index!;
            const field = filter.content.field;
            const { sqon, mapping } = getSqonAndMappingByIndex(index as INDEXES);
            setSelectedFilterContent(
              <GenericFilters
                queryBuilderId={DATA_EXPLORATION_QB_ID}
                index={index}
                field={dotToUnderscore(field)}
                sqon={sqon}
                extendedMappingResults={mapping}
              />,
            );
          },
          selectedFilterContent: selectedFilterContent,
          blacklistedFacets: [
            'participant_id',
            'participant_facet_ids.participant_fhir_id_1',
            'participant_facet_ids.participant_fhir_id_2',
            'sample_id',
            'file_id',
            'file_facet_ids.file_fhir_id_1',
            'file_facet_ids.file_fhir_id_2',
            'biospecimen_facet_ids.biospecimen_fhir_id_1',
            'biospecimen_facet_ids.biospecimen_fhir_id_2',
          ],
        }}
        enableCombine
        enableShowHideLabels
        IconTotal={<UserOutlined size={18} />}
        currentQuery={isEmptySqon(activeQuery) ? {} : activeQuery}
        dictionary={getQueryBuilderDictionary(facetTransResolver, savedSets)}
        getResolvedQueryForCount={(sqon) => resolveSqonForParticipants(queryList, sqon)}
        fetchQueryCount={async (sqon) => {
          const { data } = await ArrangerApi.graphqlRequest<{ data: IParticipantResultTree }>({
            query: GET_PARTICIPANT_COUNT.loc?.source.body,
            variables: {
              sqon: resolveSqonForParticipants(queryList, sqon),
            },
          });

          return data?.data?.participant.hits.total ?? 0;
        }}
        remoteComponentMapping={(remoteComponent: IRemoteComponent) => {
          dispatch(remoteSliceActions.openRemoteComponent(remoteComponent));
        }}
      />
      <Tabs
        type="card"
        className="navNoMarginBtm"
        activeKey={tabId || TAB_IDS.SUMMARY}
        onChange={(key) => {
          if (!history.location.pathname.includes(key)) {
            history.push(`${STATIC_ROUTES.DATA_EXPLORATION}/${key}${window.location.search}`);
          }
        }}
      >
        <Tabs.TabPane
          tab={
            <span>
              <PieChartOutlined />
              {intl.get('screen.dataExploration.tabs.summary.title')}
            </span>
          }
          key={TAB_IDS.SUMMARY}
        >
          <SummaryTab />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <UserOutlined />
              {intl.get('screen.dataExploration.tabs.participants.title', {
                count: numberWithCommas(useTotalParticipants({ sqon: participantResolvedSqon })),
              })}
            </span>
          }
          key={TAB_IDS.PARTICIPANTS}
        >
          <ParticipantsTab sqon={participantResolvedSqon} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <ExperimentOutlined />
              {intl.get('screen.dataExploration.tabs.biospecimens.title', {
                count: numberWithCommas(useTotalBiospecimens({ sqon: biospecimenResolvedSqon })),
              })}
            </span>
          }
          key={TAB_IDS.BIOSPECIMENS}
        >
          <BioSpecimenTab sqon={biospecimenResolvedSqon} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <FileTextOutlined />
              {intl.get('screen.dataExploration.tabs.datafiles.title', {
                count: numberWithCommas(useTotalDataFiles({ sqon: fileResolvedSqon })),
              })}
            </span>
          }
          key={TAB_IDS.DATA_FILES}
        >
          <DataFilesTabs sqon={fileResolvedSqon} />
        </Tabs.TabPane>
      </Tabs>
    </Space>
  );
};

export default PageContent;
