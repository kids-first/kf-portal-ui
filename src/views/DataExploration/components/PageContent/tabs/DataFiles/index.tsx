import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LockOutlined, SafetyOutlined, UnlockFilled } from '@ant-design/icons';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { Tag, Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { useDataFiles } from 'graphql/files/actions';
import {
  FileAccessType,
  IFileEntity,
  IFileStudyEntity,
  ITableFileEntity,
} from 'graphql/files/models';
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

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { FENCE_CONNECTION_STATUSES } from 'common/fenceTypes';
import CavaticaAnalyzeButton from 'components/Cavatica/AnalyzeButton';
import { SetType } from 'services/api/savedSet/models';
import { useFenceConnection } from 'store/fenceConnection';
import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { userHasAccessToFile } from 'utils/dataFiles';
import { formatFileSize } from 'utils/formatFileSize';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.scss';

interface OwnProps {
  sqon?: ISqonGroupFilter;
}

const getDefaultColumns = (
  fenceAcls: string[],
  isConnectedToCavatica: boolean,
  isConnectedToGen3: boolean,
): ProColumnType[] => [
  {
    key: 'lock',
    title: 'File Authorization',
    iconTitle: <LockOutlined />,
    tooltip: 'File Authorization',
    align: 'center',
    render: (record: IFileEntity) => {
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
    tooltip: 'Data Access',
    title: 'Data Access',
    iconTitle: <SafetyOutlined />,
    dataIndex: 'controlled_access',
    align: 'center',
    width: 75,
    render: (controlled_access: string) =>
      !controlled_access ? (
        '-'
      ) : controlled_access.toLowerCase() === FileAccessType.CONTROLLED.toLowerCase() ? (
        <Tooltip title="Controlled">
          <Tag color="geekblue">C</Tag>
        </Tooltip>
      ) : (
        <Tooltip title="Open">
          <Tag color="green">R</Tag>
        </Tooltip>
      ),
  },
  {
    key: 'file_id',
    title: 'File ID',
    dataIndex: 'file_id',
    sorter: { multiple: 1 },
    render: (file_id: string) => <Link to={`${STATIC_ROUTES.FILES}/${file_id}`}>{file_id}</Link>,
  },
  {
    key: 'study.study_code',
    title: 'Study',
    sorter: {
      multiple: 1,
    },
    dataIndex: 'study',
    render: (study: IFileStudyEntity) => study.study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'data_category',
    title: 'Data Category',
    sorter: { multiple: 1 },
    dataIndex: 'data_category',
    render: (data_category: string) => data_category || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'data_type',
    title: 'Data Type',
    dataIndex: 'data_type',
    sorter: { multiple: 1 },
    render: (data_type: string) => data_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sequencing_experiment.experiment_strategy',
    title: 'Experimental Strategy',
    sorter: { multiple: 1 },
    render: (record: IFileEntity) =>
      record.sequencing_experiment
        ? record.sequencing_experiment.hits?.edges
            .map((edge) => edge.node.experiment_strategy)
            .join(', ')
        : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'file_format',
    title: 'Format',
    dataIndex: 'file_format',
    sorter: { multiple: 1 },
  },
  {
    key: 'size',
    title: 'Size',
    dataIndex: 'size',
    sorter: { multiple: 1 },
    render: (size: number) => formatFileSize(size, { output: 'string' }),
  },
  {
    key: 'nb_participants',
    title: 'Participants',
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
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {nb_participants}
        </Link>
      ) : (
        nb_participants
      );
    },
  },
  {
    key: 'nb_biospecimens',
    title: 'Biospecimens',
    sorter: { multiple: 1 },
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
                    index: INDEXES.FILES,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {nb_biospecimens}
        </Link>
      ) : (
        nb_biospecimens
      );
    },
  },
  {
    key: 'external_id',
    title: 'External File ID',
    dataIndex: 'external_id',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (externalId: string) => externalId || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'file_name',
    title: 'File Name',
    dataIndex: 'file_name',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
  {
    key: 'platform',
    title: 'Platform',
    dataIndex: 'platform',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'repository',
    title: 'Repository',
    dataIndex: 'repository',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
  {
    key: 'acl',
    title: 'ACL',
    dataIndex: 'acl',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: (acl: string[]) => acl?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'latest_did',
    title: 'Latest DID',
    dataIndex: 'latest_did',
    defaultHidden: true,
    sorter: { multiple: 1 },
    render: () => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'access_urls',
    title: 'Access URL',
    dataIndex: 'access_urls',
    defaultHidden: true,
    sorter: { multiple: 1 },
  },
];

const DataFilesTab = ({ sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const { fencesAllAcls, connectionStatus } = useFenceConnection();
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

  const getCurrentSqon = (): any =>
    selectedAllResults || !selectedKeys.length
      ? sqon
      : generateQuery({
          newFilters: [
            generateValueFilter({
              field: DATA_FILES_SAVED_SETS_FIELD,
              index: INDEXES.FILES,
              value: selectedRows.map((row) => row[DATA_FILES_SAVED_SETS_FIELD]),
            }),
          ],
        });

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
      setSelectedRows([]);
    }
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
          connectionStatus.cavatica === FENCE_CONNECTION_STATUSES.connected,
          connectionStatus.gen3 === FENCE_CONNECTION_STATUSES.connected,
        )}
        initialSelectedKey={selectedKeys}
        wrapperClassName={styles.dataFilesTabWrapper}
        loading={results.loading}
        initialColumnState={userInfo?.config.data_exploration?.tables?.datafiles?.columns}
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
                columnStates: userInfo?.config.data_exploration?.tables?.datafiles?.columns,
                columns: getDefaultColumns(
                  fencesAllAcls,
                  connectionStatus.cavatica === FENCE_CONNECTION_STATUSES.connected,
                  connectionStatus.gen3 === FENCE_CONNECTION_STATUSES.connected,
                ),
                index: INDEXES.FILES,
                sqon: getCurrentSqon(),
              }),
            ),
          onColumnSortChange: (newState) =>
            dispatch(
              updateUserConfig({
                data_exploration: {
                  tables: {
                    datafiles: {
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
              type={SetType.FILES}
              selectedKeys={selectedKeys}
              key="file-set-management"
            />,
            <CavaticaAnalyzeButton
              disabled={selectedKeys.length === 0 && !selectedAllResults}
              type="primary"
              fileIds={selectedAllResults ? [] : selectedKeys}
              sqon={sqon}
              key="file-cavatica-upload"
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
                    datafiles: {
                      ...userInfo?.config.data_exploration?.tables?.datafiles,
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
