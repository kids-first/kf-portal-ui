import { ReactElement, useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ExperimentOutlined,
  FileTextOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import VennModal from '@ferlab/ui/core/components/Charts/Venn/VennModal';
import { TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { ISavedFilter } from '@ferlab/ui/core/components/QueryBuilder/types';
import { addQuery } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { dotToUnderscore } from '@ferlab/ui/core/data/arranger/formatting';
import {
  IRemoteComponent,
  ISqonGroupFilter,
  ISyntheticSqon,
  SET_ID_PREFIX,
} from '@ferlab/ui/core/data/sqon/types';
import {
  generateQuery,
  generateValueFilter,
  isEmptySqon,
  resolveSyntheticSqon,
} from '@ferlab/ui/core/data/sqon/utils';
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
import {
  BIOSPECIMENS_SAVED_SETS_FIELD,
  DATA_EXPLORATION_QB_ID,
  TAB_IDS,
} from 'views/DataExploration/utils/constant';

import { SHARED_FILTER_ID_QUERY_PARAM_KEY } from 'common/constants';
import GenericFilters from 'components/uiKit/FilterList/GenericFilters';
import { FilterInfo } from 'components/uiKit/FilterList/types';
import { getNoDataOptionValue } from 'components/utils/filterUtils';
import useFeatureToggle from 'hooks/useFeatureToggle';
import useQBStateWithSavedFilters from 'hooks/useQBStateWithSavedFilters';
import {
  trackCompareQueries,
  trackFilterActions,
  trackVennCancel,
  trackVennClickOnSections,
  trackVennViewEntityCounts,
  trackVennViewInExploration,
  trackVennViewSet,
} from 'services/analytics';
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
import { getSetFieldId, PROJECT_ID, useSavedSet } from 'store/savedSet';
import { createSavedSet, fetchSetsAliases } from 'store/savedSet/thunks';
import { useVennData } from 'store/venn';
import { fetchVennData } from 'store/venn/thunks';
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

import styles from './index.module.css';

const FT_FLAG_VENN_COMPARE = 'VENN_COMPARE';

const { Title } = Typography;

export const MAX_TITLE_LENGTH = 200;

export enum FilterActionType {
  UPDATE_FILTER = 'UPDATE_FILTER',
  CREATE_FILTER = 'CREATE_FILTER',
  REMOVE_FILTER = 'REMOVE_FILTER',
  FAVORITE_FILTER = 'CREATE_SET',
  SHARE_FILTER = 'HIDDEN',
}

type OwnProps = {
  fileMapping: IExtendedMappingResults;
  biospecimenMapping: IExtendedMappingResults;
  participantMapping: IExtendedMappingResults;
  filterGroups: {
    [type: string]: FilterInfo;
  };
};

const addTagToFilter = (filter: ISavedFilter) => ({
  ...filter,
  tag: SavedFilterTag.ParticipantsExplorationPage,
});

const getIdField = (setType: string) => {
  switch (setType) {
    case INDEXES.BIOSPECIMEN:
      return BIOSPECIMENS_SAVED_SETS_FIELD;
    default:
      return 'fhir_id';
  }
};

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
  filterGroups,
}: OwnProps) => {
  const dispatch = useDispatch<any>();
  const { tab } = useParams<{ tab: string }>();
  const [tabId, setTabId] = useState<TAB_IDS>((tab as TAB_IDS) ?? TAB_IDS.SUMMARY);
  const { isEnabled } = useFeatureToggle(FT_FLAG_VENN_COMPARE);
  const location = useLocation();
  const navigate = useNavigate();
  const { savedSets, alias } = useSavedSet();
  const vennData = useVennData();
  const [vennOpen, setVennOpen] = useState<boolean>(false);
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

  const handleOnUpdateFilter = (filter: ISavedFilter) => {
    trackFilterActions(FilterActionType.UPDATE_FILTER, tabId);
    dispatch(updateSavedFilter(filter));
  };
  const handleOnSaveFilter = (filter: ISavedFilter) => {
    trackFilterActions(FilterActionType.CREATE_FILTER, tabId);
    dispatch(createSavedFilter(addTagToFilter(filter)));
  };
  const handleOnDeleteFilter = (id: string) => {
    trackFilterActions(FilterActionType.REMOVE_FILTER, tabId);
    dispatch(deleteSavedFilter(id));
  };
  const handleOnSaveAsFavorite = (filter: ISavedFilter) => {
    trackFilterActions(FilterActionType.FAVORITE_FILTER, tabId);
    dispatch(setSavedFilterAsDefault(addTagToFilter(filter)));
  };
  const handleOnShareFilter = (filter: ISavedFilter) => {
    trackFilterActions(FilterActionType.SHARE_FILTER, tabId);
    copy(`${getCurrentUrl()}?${SHARED_FILTER_ID_QUERY_PARAM_KEY}=${filter.id}`);
    dispatch(
      globalActions.displayMessage({
        content: 'Copied share url',
        type: 'success',
      }),
    );
  };
  const handleCompare = isEnabled
    ? (queries: ISyntheticSqon[]) => {
        trackCompareQueries();
        setVennOpen(true);

        dispatch(fetchVennData({ qbSqons: queries }));
      }
    : undefined;

  useEffect(() => {
    dispatch(fetchSetsAliases(queryList));
  }, [queryList]);

  useEffect(() => {
    setTabId(tab as TAB_IDS);
  }, [tab]);

  return (
    <>
      <VennModal
        analytics={{
          trackVennViewInExploration,
          trackVennClickOnSections,
          trackVennViewSet,
          trackVennViewEntityCounts,
        }}
        vennSize={{ width: 540, height: 498 }}
        savedSets={savedSets}
        handleSubmit={({ index, name, sets, invisible, callback }) => {
          const sqons: ISyntheticSqon[] = sets.map((set) => set.entitySqon);
          const sqonGroupFilter: ISqonGroupFilter = { op: 'or', content: [] };
          sets.forEach((set) => {
            sqonGroupFilter.content.push(resolveSyntheticSqon(sqons, set.entitySqon));
          });

          dispatch(
            createSavedSet({
              idField: getIdField(index),
              projectId: PROJECT_ID,
              sort: [],
              sqon: sqonGroupFilter,
              tag: name,
              type: index,
              is_invisible: invisible,
              onCompleteCb: (data) => {
                callback();
                if (!data) return;
                const setValue = `${SET_ID_PREFIX}${data.id}`;
                addQuery({
                  queryBuilderId: DATA_EXPLORATION_QB_ID,
                  query: generateQuery({
                    newFilters: [
                      generateValueFilter({
                        field: getSetFieldId(data.setType),
                        value: [setValue],
                        index: data.setType,
                      }),
                    ],
                  }),
                  setAsActive: true,
                });
              },
            }),
          );

          let newTabId = TAB_IDS.PARTICIPANTS;
          if (index === INDEXES.BIOSPECIMEN) {
            newTabId = TAB_IDS.BIOSPECIMENS;
          } else if (index === INDEXES.FILE) {
            newTabId = TAB_IDS.DATA_FILES;
          }
          if (!location.pathname.includes(newTabId)) {
            navigate(`${STATIC_ROUTES.DATA_EXPLORATION}/${newTabId}${window.location.search}`);
          }

          setTabId(newTabId as TAB_IDS);
        }}
        queryPillDictionary={getQueryBuilderDictionary(facetTransResolver, savedSets, alias)}
        error={vennData.error}
        options={[
          {
            label: intl.get('screen.dataExploration.venn.participants'),
            value: INDEXES.PARTICIPANT,
            tabId: TAB_IDS.PARTICIPANTS,
            icon: <UserOutlined size={16} />,
          },
          {
            label: intl.get('screen.dataExploration.venn.biospecimens'),
            value: INDEXES.BIOSPECIMEN,
            tabId: TAB_IDS.BIOSPECIMENS,
            icon: <ExperimentOutlined size={16} />,
          },

          {
            label: intl.get('screen.dataExploration.venn.files'),
            value: INDEXES.FILE,
            tabId: TAB_IDS.DATA_FILES,
            icon: <FileTextOutlined size={16} />,
          },
        ]}
        open={vennOpen}
        summary={vennData.summary}
        operations={vennData.operations}
        loading={vennData.loading}
        handleClose={() => {
          trackVennCancel();
          setVennOpen(false);
        }}
        handleIndexChange={(qbSqons: ISyntheticSqon[], index: string) => {
          dispatch(fetchVennData({ qbSqons, index: index as INDEXES }));
        }}
        dictionary={{
          query: {
            column: intl.get('screen.dataExploration.venn.query.column'),
            title: intl.get('screen.dataExploration.venn.query.title'),
          },
          download: {
            png: intl.get('screen.dataExploration.venn.download.png'),
            fileNameDateFormat: intl.get('screen.dataExploration.venn.download.fileNameDateFormat'),
            fileNameTemplate: intl.get('screen.dataExploration.venn.download.fileNameTemplate'),
          },
          set: {
            column: intl.get('screen.dataExploration.venn.set.column'),
            title: intl.get('screen.dataExploration.venn.set.title'),
            footer: intl.get('screen.dataExploration.venn.set.footer'),
            tooltipDataExplo: intl.get('screen.dataExploration.venn.set.tooltips'),
            max: intl.get('screen.dataExploration.venn.set.max'),
          },
          save: {
            nameTemplate: intl.get('screen.dataExploration.venn.save.nameTemplate'),
            maximumLength: intl.get(
              'components.querybuilder.header.modal.edit.input.maximumLength',
            ),
            permittedCharacters: intl.get('components.savedSets.modal.errors.permittedCharacters'),
            alreadyExist: intl.get('screen.dataExploration.venn.save.alreadyExist'),
            requiredField: intl.get('global.forms.errors.requiredField'),
            titleData: intl.get('screen.dataExploration.venn.save.title'),
            getEntityText: (index: string, entityCount: number) => {
              if (index === INDEXES.BIOSPECIMEN) {
                return intl.get('screen.dataExploration.venn.save.entity.biospecimens', {
                  count: entityCount,
                });
              } else if (index === INDEXES.FILE) {
                return intl.get('screen.dataExploration.venn.save.entity.files', {
                  count: entityCount,
                });
              } else {
                return intl.get('screen.dataExploration.venn.save.entity.participants', {
                  count: entityCount,
                });
              }
            },
            label: intl.get('screen.dataExploration.venn.save.label'),
            checkbox: {
              label: intl.get('screen.dataExploration.venn.save.checkbox.label'),
              tooltips: intl.get('screen.dataExploration.venn.save.checkbox.tooltips'),
            },
            ok: intl.get('screen.dataExploration.venn.save.ok'),
            cancel: intl.get('screen.dataExploration.venn.save.cancel'),
          },
          participants: intl.get('screen.dataExploration.venn.participants'),
          biospecimens: intl.get('screen.dataExploration.venn.biospecimens'),
          files: intl.get('screen.dataExploration.venn.files'),
          title: intl.get('screen.dataExploration.venn.title'),
          count: intl.get('screen.dataExploration.venn.count'),
          ok: intl.get('screen.dataExploration.venn.ok'),
        }}
      />
      <Space direction="vertical" size={24} className={styles.dataExplorePageContent}>
        <Title className={styles.title} level={4}>
          {intl.get('screen.dataExploration.title')}
        </Title>
        <QueryBuilder
          id={DATA_EXPLORATION_QB_ID}
          className="data-exploration-repo__query-builder"
          handleCompare={handleCompare}
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
              const noDataInputOption = getNoDataOptionValue(
                field.replaceAll('.', '__'),
                filterGroups,
              );
              setSelectedFilterContent(
                <GenericFilters
                  queryBuilderId={DATA_EXPLORATION_QB_ID}
                  index={index}
                  field={dotToUnderscore(field)}
                  sqon={sqon}
                  extendedMappingResults={mapping}
                  noDataInputOption={noDataInputOption}
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
          dictionary={getQueryBuilderDictionary(facetTransResolver, savedSets, alias)}
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
          activeKey={tabId}
          onChange={(key) => {
            if (!location.pathname.includes(key)) {
              navigate(`${STATIC_ROUTES.DATA_EXPLORATION}/${key}${window.location.search}`);
            }
            setTabId(key as TAB_IDS);
          }}
          items={[
            {
              key: TAB_IDS.SUMMARY,
              label: (
                <span>
                  <PieChartOutlined />
                  {intl.get('screen.dataExploration.tabs.summary.title')}
                </span>
              ),
              children: <SummaryTab />,
            },
            {
              key: TAB_IDS.PARTICIPANTS,
              label: (
                <span>
                  <UserOutlined />
                  {intl.get('screen.dataExploration.tabs.participants.title', {
                    count: numberWithCommas(
                      useTotalParticipants({ sqon: participantResolvedSqon }),
                    ),
                  })}
                </span>
              ),
              children: <ParticipantsTab sqon={participantResolvedSqon} />,
            },
            {
              key: TAB_IDS.BIOSPECIMENS,
              label: (
                <span>
                  <ExperimentOutlined />
                  {intl.get('screen.dataExploration.tabs.biospecimens.title', {
                    count: numberWithCommas(
                      useTotalBiospecimens({ sqon: biospecimenResolvedSqon }),
                    ),
                  })}
                </span>
              ),
              children: <BioSpecimenTab sqon={biospecimenResolvedSqon} />,
            },
            {
              key: TAB_IDS.DATA_FILES,
              label: (
                <span>
                  <FileTextOutlined />
                  {intl.get('screen.dataExploration.tabs.datafiles.title', {
                    count: numberWithCommas(useTotalDataFiles({ sqon: fileResolvedSqon })),
                  })}
                </span>
              ),
              children: <DataFilesTabs sqon={fileResolvedSqon} />,
            },
          ]}
        />
      </Space>
    </>
  );
};

export default PageContent;
