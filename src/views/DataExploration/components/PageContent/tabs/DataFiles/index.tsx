import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LockOutlined, SafetyOutlined, UnlockFilled, WarningOutlined } from '@ant-design/icons';
import ExternalLinkIcon from '@ferlab/ui/core/components/ExternalLink/ExternalLinkIcon';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink/index';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { resetSearchAfterQueryConfig, tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { FENCE_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/AuthorizedStudies';
import { PASSPORT_AUTHENTIFICATION_STATUS } from '@ferlab/ui/core/components/Widgets/Cavatica/type';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';
import { Popover, Tag, Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { useDataFiles } from 'graphql/files/actions';
import {
  FileAccessType,
  IFileEntity,
  IFileStudyEntity,
  IImagingData,
  ITableFileEntity,
} from 'graphql/files/models';
import { joinUniqueCleanWords } from 'helpers';
import { capitalize } from 'lodash';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
import {
  DATA_EXPLORATION_QB_ID,
  DATA_FILES_SAVED_SETS_FIELD,
  DEFAULT_FILE_QUERY_SORT,
  DEFAULT_OFFSET,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  SCROLL_WRAPPER_ID,
} from 'views/DataExploration/utils/constant';

import { MAX_ITEMS_QUERY, TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { FENCE_NAMES } from 'common/fenceTypes';
import CavaticaAnalyzeButton from 'components/Cavatica/AnalyzeButton';
import DownloadFileManifestModal from 'components/uiKit/reports/DownloadFileManifestModal';
import { SetType } from 'services/api/savedSet/models';
import { useAllFencesAcl, useFenceAuthentification } from 'store/fences';
import { useCavaticaPassport } from 'store/passport';
import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { userHasAccessToFile } from 'utils/dataFiles';
import { formatFileSize } from 'utils/formatFileSize';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import ColumnSelectorHeader from './ColumnSelectorHeader';

import styles from './index.module.css';

export enum PresetOptions {
  Imaging = 'imaging',
  Datafiles = 'datafiles',
}

interface OwnProps {
  sqon?: ISqonGroupFilter;
}

export const getDefaultColumns = (
  fenceAcls: string[],
  isConnectedToCavatica: boolean,
  isConnectedToGen3: boolean,
  activePreset: PresetOptions,
): ProColumnType[] => [
  {
    key: 'lock',
    title: intl.get('entities.file.fileAuthorization'),
    iconTitle: <LockOutlined />,
    tooltip: intl.get('entities.file.fileAuthorization'),
    align: 'center',
    render: (record: IFileEntity) => {
      if (
        record.controlled_access.toLowerCase() === FileAccessType.CONTROLLED.toLowerCase() &&
        record.access_urls?.startsWith('drs://cavatica-ga4gh-api.sbgenomics.com/')
      ) {
        return (
          <Popover
            placement="top"
            overlayStyle={{ maxWidth: '420px' }}
            title={intl.get(
              'screen.dataExploration.tabs.datafiles.undeterminedAuthorization.popoverTitle',
            )}
            content={intl.getHTML(
              'screen.dataExploration.tabs.datafiles.undeterminedAuthorization.popoverContent',
              {
                href: 'https://kidsfirstdrc.org/help-center/accessing-controlled-data-via-dbgap/',
              },
            )}
          >
            <WarningOutlined className={styles.authorizedUndetermined} />
          </Popover>
        );
      }

      const hasAccess = userHasAccessToFile(
        record,
        fenceAcls,
        isConnectedToCavatica,
        isConnectedToGen3,
      );

      return hasAccess ? (
        <Tooltip title="Authorized">
          <UnlockFilled className={styles.authorizedLock} />
        </Tooltip>
      ) : (
        <Tooltip title="Unauthorized">
          <LockOutlined className={styles.unauthorizedLock} />
        </Tooltip>
      );
    },
  },
  {
    key: 'controlled_access',
    tooltip: intl.get('entities.file.data_access.title'),
    title: intl.get('entities.file.data_access.title'),
    iconTitle: <SafetyOutlined />,
    dataIndex: 'controlled_access',
    align: 'center',
    width: 75,
    render: (controlled_access: string) => {
      if (!controlled_access) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return controlled_access.toLowerCase() === FileAccessType.CONTROLLED.toLowerCase() ? (
        <Tooltip title="Controlled">
          <Tag color="geekblue">C</Tag>
        </Tooltip>
      ) : (
        <Tooltip title="Open">
          <Tag color="green">R</Tag>
        </Tooltip>
      );
    },
  },
  {
    key: 'file_id',
    title: intl.get('entities.file.file_id'),
    dataIndex: 'file_id',
    sorter: { multiple: 1 },
    render: (file_id: string) =>
      file_id ? (
        <Link to={`${STATIC_ROUTES.FILES}/${file_id}`}>{file_id}</Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'study.study_code',
    title: intl.get('entities.participant.study'),
    sorter: {
      multiple: 1,
    },
    dataIndex: 'study',
    render: (study: IFileStudyEntity) =>
      study.study_code ? (
        <Tooltip title={study.study_name}>{study.study_code}</Tooltip>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'data_category',
    title: intl.get('entities.file.data_access.data_category'),
    defaultHidden: activePreset !== PresetOptions.Datafiles,
    sorter: { multiple: 1 },
    dataIndex: 'data_category',
    render: (data_category: string) => data_category || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'data_type',
    title: intl.get('entities.file.data_access.data_type'),
    dataIndex: 'data_type',
    defaultHidden: activePreset !== PresetOptions.Datafiles,
    sorter: { multiple: 1 },
    render: (data_type: string) => data_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sequencing_experiment.experiment_strategy',
    title: intl.get('entities.file.data_access.experimental_strategy'),
    sorter: { multiple: 1 },
    defaultHidden: activePreset !== PresetOptions.Datafiles,
    render: (record: IFileEntity) =>
      (record.sequencing_experiment &&
        record.sequencing_experiment.hits?.edges.at(0)?.node.experiment_strategy) ||
      TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'file_format',
    title: intl.get('entities.file.data_access.format'),
    dataIndex: 'file_format',
    defaultHidden: activePreset !== PresetOptions.Datafiles,
    sorter: { multiple: 1 },
    render: (file_format: string) => (file_format ? file_format : TABLE_EMPTY_PLACE_HOLDER),
  },
  {
    key: 'size',
    title: intl.get('entities.file.data_access.size'),
    dataIndex: 'size',
    defaultHidden: activePreset !== PresetOptions.Datafiles,
    sorter: { multiple: 1 },
    render: (size: number) => formatFileSize(size, { output: 'string' }),
  },
  {
    key: 'nb_participants',
    title: intl.get('entities.file.data_access.participants'),
    sorter: { multiple: 1 },
    render: (record: IFileEntity) => {
      const nb_participants = record?.nb_participants || 0;
      return nb_participants ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_PARTICIPANTS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'file_id',
                    value: [record.file_id],
                    index: INDEXES.FILE,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {numberWithCommas(nb_participants)}
        </Link>
      ) : (
        nb_participants
      );
    },
  },
  {
    key: 'imaging.session_n_total_acquisitions',
    title: intl.get('entities.file.imaging.session.label'),
    tooltip: intl.get('entities.file.imaging.session.tooltip'),
    defaultHidden: activePreset === PresetOptions.Datafiles,
    sorter: { multiple: 1 },
    render: (record: IFileEntity) =>
      record.imaging?.session_n_total_acquisitions ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'imaging.session_id',
                    value: [record.imaging?.session_id!],
                    index: INDEXES.FILE,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
          style={{ textDecoration: 'underline' }}
        >
          {record.imaging?.session_n_total_acquisitions}
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'nb_biospecimens',
    title: intl.get('entities.biospecimen.biospecimens'),
    sorter: { multiple: 1 },
    defaultHidden: activePreset !== PresetOptions.Datafiles,
    render: (record: IFileEntity) => {
      const nb_biospecimens = record?.nb_biospecimens || 0;
      return nb_biospecimens ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'file_id',
                    value: [record.file_id],
                    index: INDEXES.FILE,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {numberWithCommas(nb_biospecimens)}
        </Link>
      ) : (
        nb_biospecimens
      );
    },
  },
  {
    key: 'file_name',
    title: intl.get('entities.file.data_access.file_name'),
    dataIndex: 'file_name',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
  {
    key: 'sequencing_experiment.platform',
    title: intl.get('entities.file.experimental_procedure.platform'),
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (record: IFileEntity) =>
      record.sequencing_experiment?.hits?.edges?.[0]?.node?.platform || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'repository',
    title: intl.get('entities.file.repository'),
    dataIndex: 'repository',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (repository: string) => capitalize(repository) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'acl',
    title: intl.get('entities.file.acl'),
    dataIndex: 'acl',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (acl: string[]) => acl?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'access_urls',
    title: intl.get('entities.file.access_url'),
    dataIndex: 'access_urls',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (access_urls: string) => access_urls || TABLE_EMPTY_PLACE_HOLDER,
  },
  // Imaging columns
  {
    key: 'flywheel_url',
    title: intl.get('entities.file.flywheel'),
    dataIndex: 'flywheel_url',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (flywheel_url?: string) =>
      flywheel_url ? (
        <ExternalLink href={flywheel_url}>
          <ExternalLinkIcon />
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'imaging.modality',
    title: intl.get('entities.file.imaging.modality.value'),
    tooltip: intl.get('entities.file.imaging.modality.tooltip'),
    dataIndex: 'imaging',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (imaging?: IImagingData) => imaging?.modality || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging_sequence_types',
    title: intl.get('entities.file.imaging.sequence_type'),
    dataIndex: 'imaging_sequence_types',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (imaging_sequence_types?: string[]) =>
      imaging_sequence_types
        ? joinUniqueCleanWords(imaging_sequence_types)
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging_techniques',
    title: intl.get('entities.file.imaging.technique'),
    dataIndex: 'imaging_techniques',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (imaging_techniques?: string[]) =>
      imaging_techniques ? joinUniqueCleanWords(imaging_techniques) : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging.info_body_part_examined',
    title: intl.get('entities.file.imaging.body_part.value'),
    tooltip: intl.get('entities.file.imaging.body_part.tooltip'),
    dataIndex: 'imaging',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (imaging?: IImagingData) =>
      imaging?.info_body_part_examined || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging.device.magnetic_field_strength',
    title: intl.get('entities.file.imaging.device.field_strength.value'),
    tooltip: intl.get('entities.file.imaging.device.field_strength.tooltip'),
    dataIndex: 'imaging',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (imaging?: IImagingData) =>
      imaging?.device?.magnetic_field_strength || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging.device.manufacturer',
    title: intl.get('entities.file.imaging.device.manufacturer'),
    dataIndex: 'imaging',
    defaultHidden: activePreset !== PresetOptions.Imaging,
    sorter: { multiple: 1 },
    render: (imaging?: IImagingData) => imaging?.device?.manufacturer || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging.device.model_name',
    title: intl.get('entities.file.imaging.device.model'),
    dataIndex: 'imaging',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (imaging?: IImagingData) => imaging?.device?.model_name || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'imaging.device.device_id',
    title: intl.get('entities.file.imaging.device.id'),
    dataIndex: 'imaging',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (imaging?: IImagingData) => imaging?.device?.device_id || TABLE_EMPTY_PLACE_HOLDER,
  },
];

const DataFilesTab = ({ sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const cavatica = useCavaticaPassport();
  const gen3 = useFenceAuthentification(FENCE_NAMES.gen3);
  const fencesAllAcls = useAllFencesAcl();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const [selectedAllResults, setSelectedAllResults] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<ITableFileEntity[]>([]);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [queryConfig, setQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    sort: DEFAULT_FILE_QUERY_SORT,
    size:
      userInfo?.config?.data_exploration?.tables?.participants?.viewPerQuery || DEFAULT_PAGE_SIZE,
  });
  const results = useDataFiles(
    {
      first: queryConfig.size,
      offset: DEFAULT_OFFSET,
      searchAfter: queryConfig.searchAfter,
      sqon,
      sort: tieBreaker({
        sort: queryConfig.sort,
        defaultSort: DEFAULT_FILE_QUERY_SORT,
        field: 'file_id',
        order: queryConfig.operations?.previous ? SortDirection.Desc : SortDirection.Asc,
      }),
    },
    queryConfig.operations,
  );

  const cachedPreset = localStorage.getItem('activePreset') as PresetOptions;
  const [activePreset, setActivePreset] = useState<PresetOptions>(
    cachedPreset || PresetOptions.Datafiles,
  );

  const handlePresetSelection = (presetOption: PresetOptions) => {
    setActivePreset(presetOption);
    localStorage.setItem('activePreset', presetOption);
  };

  const hasTooManyFiles =
    selectedKeys.length > MAX_ITEMS_QUERY ||
    (selectedAllResults && results.total > MAX_ITEMS_QUERY);

  const getCurrentSqon = (): any =>
    selectedAllResults || !selectedKeys.length
      ? sqon
      : generateQuery({
          newFilters: [
            generateValueFilter({
              field: DATA_FILES_SAVED_SETS_FIELD,
              index: INDEXES.FILE,
              value: selectedRows.map((row) => row[DATA_FILES_SAVED_SETS_FIELD]),
            }),
          ],
        });

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
      setSelectedRows([]);
    }

    resetSearchAfterQueryConfig(
      {
        ...DEFAULT_QUERY_CONFIG,
        sort: DEFAULT_FILE_QUERY_SORT,
        size:
          userInfo?.config?.data_exploration?.tables?.participants?.viewPerQuery ||
          DEFAULT_PAGE_SIZE,
      },
      setQueryConfig,
    );
    setPageIndex(DEFAULT_PAGE_INDEX);
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

  useEffect(() => {
    if (queryConfig.firstPageFlag !== undefined || queryConfig.searchAfter === undefined) {
      return;
    }

    setQueryConfig({
      ...queryConfig,
      firstPageFlag: queryConfig.searchAfter,
    });
  }, [queryConfig]);

  return (
    <>
      <ProTable<ITableFileEntity>
        tableId="datafiles_table"
        columns={getDefaultColumns(
          fencesAllAcls,
          cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected,
          gen3.status === FENCE_AUTHENTIFICATION_STATUS.connected,
          activePreset,
        )}
        initialSelectedKey={selectedKeys}
        wrapperClassName={styles.dataFilesTabWrapper}
        loading={results.loading}
        initialColumnState={userInfo?.config.data_exploration?.tables?.[activePreset]?.columns}
        enableRowSelection={true}
        showSorterTooltip={false}
        onChange={(_pagination, _filter, sorter) => {
          setPageIndex(DEFAULT_PAGE_INDEX);
          setQueryConfig({
            pageIndex: DEFAULT_PAGE_INDEX,
            size: queryConfig.size!,
            sort: formatQuerySortList(sorter),
          });
        }}
        headerConfig={{
          columnSelectorHeader: (
            <ColumnSelectorHeader
              activePreset={activePreset}
              handlePresetSelection={handlePresetSelection}
            />
          ),
          itemCount: {
            pageIndex: pageIndex,
            pageSize: queryConfig.size,
            total: results.total,
          },
          enableColumnSort: true,
          enableTableExport: true,
          onSelectAllResultsChange: setSelectedAllResults,
          onSelectedRowsChange: (keys, rows) => {
            setSelectedKeys(keys);
            setSelectedRows(rows);
          },
          onTableExportClick: () =>
            dispatch(
              fetchTsvReport({
                columnStates: userInfo?.config.data_exploration?.tables?.[activePreset]?.columns,
                columns: getDefaultColumns(
                  fencesAllAcls,
                  cavatica.authentification.status === PASSPORT_AUTHENTIFICATION_STATUS.connected,
                  gen3.status === FENCE_AUTHENTIFICATION_STATUS.connected,
                  activePreset,
                ),
                index: INDEXES.FILE,
                sqon: getCurrentSqon(),
              }),
            ),
          onColumnSortChange: (newState) =>
            dispatch(
              updateUserConfig({
                data_exploration: {
                  tables: {
                    [activePreset]: {
                      columns: newState,
                    },
                  },
                },
              }),
            ),
          extra: [
            <SetsManagementDropdown
              idField="fhir_id"
              results={results}
              sqon={getCurrentSqon()}
              selectedAllResults={selectedAllResults}
              type={SetType.FILE}
              selectedKeys={selectedKeys}
              key="file-set-management"
              analyticsPage={intl.get('global.googleAnalytics.fileTab')}
            />,
            <DownloadFileManifestModal
              key="download-file-manifest"
              sqon={getCurrentSqon()}
              isDisabled={!selectedKeys.length && !selectedAllResults}
              hasTooManyFiles={hasTooManyFiles}
            />,
            <CavaticaAnalyzeButton
              disabled={selectedKeys.length === 0 && !selectedAllResults}
              maxFileReached={hasTooManyFiles}
              type="primary"
              fileIds={selectedAllResults ? [] : selectedKeys}
              sqon={sqon}
              sort={queryConfig.sort ?? DEFAULT_FILE_QUERY_SORT}
              key="file-cavatica-upload"
              index={INDEXES.FILE}
            />,
          ],
        }}
        bordered
        size="small"
        pagination={{
          current: pageIndex,
          queryConfig,
          setQueryConfig,
          onChange: (page: number) => {
            scrollToTop(SCROLL_WRAPPER_ID);
            setPageIndex(page);
          },
          searchAfter: results.searchAfter,
          onViewQueryChange: (viewPerQuery: PaginationViewPerQuery) => {
            dispatch(
              updateUserConfig({
                data_exploration: {
                  tables: {
                    [activePreset]: {
                      ...userInfo?.config.data_exploration?.tables?.[activePreset],
                      viewPerQuery,
                    },
                  },
                },
              }),
            );
          },
          defaultViewPerQuery: queryConfig.size,
        }}
        dataSource={results.data.map((i) => ({ ...i, key: i.file_id }))}
        dictionary={getProTableDictionary()}
      />
    </>
  );
};

export default DataFilesTab;
