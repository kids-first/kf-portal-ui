import { FileAccessType, IFileEntity, ITableFileEntity } from 'graphql/files/models';
import { CloudUploadOutlined, LockOutlined, SafetyOutlined, UnlockFilled } from '@ant-design/icons';
import { IQueryResults } from 'graphql/models';
import { IQueryConfig, TQueryConfigCb } from 'common/searchPageTypes';
import {
  CAVATICA_FILE_BATCH_SIZE,
  DATA_EXPLORATION_QB_ID,
  DEFAULT_PAGE_SIZE,
  SCROLL_WRAPPER_ID,
  TAB_IDS,
} from 'views/DataExploration/utils/constant';
import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { getProTableDictionary } from 'utils/translation';
import { useDispatch } from 'react-redux';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { useEffect, useState } from 'react';
import { formatFileSize } from 'utils/formatFileSize';
import { Button, Modal, Tag, Tooltip } from 'antd';
import AnalyseModal from 'views/Dashboard/components/DashboardCards/Cavatica/AnalyseModal';
import { fetchTsvReport } from 'store/report/thunks';
import { INDEXES } from 'graphql/constants';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import CreateProjectModal from 'views/Dashboard/components/DashboardCards/Cavatica/CreateProjectModal';
import intl from 'react-intl-universal';
import { beginAnalyse } from 'store/fenceCavatica/thunks';
import { useFenceConnection } from 'store/fenceConnection';
import { useFenceCavatica } from 'store/fenceCavatica';
import { connectToFence } from 'store/fenceConnection/thunks';
import { FENCE_CONNECTION_STATUSES, FENCE_NAMES } from 'common/fenceTypes';
import { fenceCavaticaActions } from 'store/fenceCavatica/slice';
import { generateSelectionSqon } from 'views/DataExploration/utils/selectionSqon';
import { Link } from 'react-router-dom';
import { STATIC_ROUTES } from 'utils/routes';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { userHasAccessToFile } from 'utils/dataFiles';
import { scrollToTop, formatQuerySortList } from 'utils/helper';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
import { SetType } from 'services/api/savedSet/models';

import styles from './index.module.scss';

interface OwnProps {
  results: IQueryResults<IFileEntity[]>;
  setQueryConfig: TQueryConfigCb;
  queryConfig: IQueryConfig;
  sqon?: ISqonGroupFilter;
}

const getDefaultColumns = (
  fenceAcls: string[],
  isConnectedToCavatica: boolean,
  isConnectedToGen3: boolean,
): ProColumnType<any>[] => [
  {
    key: 'lock',
    title: (
      <Tooltip title="File Authorization">
        <LockOutlined />
      </Tooltip>
    ),
    displayTitle: 'File Authorization',
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
    title: (
      <Tooltip title="Data access">
        <SafetyOutlined />
      </Tooltip>
    ),
    dataIndex: 'controlled_access',
    displayTitle: 'Data access',
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
        <Tooltip title="Registered">
          <Tag color="green">R</Tag>
        </Tooltip>
      ),
  },
  {
    key: 'file_id',
    title: 'File ID',
    dataIndex: 'file_id',
    sorter: { multiple: 1 },
  },
  {
    key: 'file_name',
    title: 'File Name',
    dataIndex: 'file_name',
    sorter: { multiple: 1 },
    defaultHidden: true,
  },
  {
    key: 'study.study_id',
    title: 'Study',
    sorter: { multiple: 1 },
    render: (record: IFileEntity) => record.study.study_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'data_category',
    title: 'Data Category',
    dataIndex: 'data_category',
    sorter: { multiple: 1 },
  },
  {
    key: 'data_type',
    title: 'Data Type',
    dataIndex: 'data_type',
    sorter: { multiple: 1 },
    render: (data_type) => data_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sequencing_experiment__experiment_strategy',
    title: 'Experimental Strategy',
    sorter: { multiple: 1 },
    render: (record: IFileEntity) =>
      record.sequencing_experiment?.experiment_strategy || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'access_urls',
    title: 'Access Url',
    dataIndex: 'access_urls',
    sorter: { multiple: 1 },
    defaultHidden: true,
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
    render: (size) => formatFileSize(size, { output: 'string' }),
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
                    index: INDEXES.FILE,
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
                    index: INDEXES.FILE,
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
];

const DataFilesTab = ({ results, setQueryConfig, queryConfig, sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const { isConnected, isInitializingAnalyse, beginAnalyseAfterConnection } = useFenceCavatica();
  const { fencesAllAcls, connectionStatus } = useFenceConnection();
  const [selectedAllResults, setSelectedAllResults] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<ITableFileEntity[]>([]);

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

  const onBeginAnalyse = () =>
    dispatch(
      beginAnalyse({
        sqon: sqon!,
        fileIds: selectedAllResults ? [] : selectedKeys,
      }),
    );

  const getCurrentSqon = (): any =>
    selectedAllResults || !selectedKeys.length
      ? sqon
      : generateSelectionSqon(TAB_IDS.DATA_FILES, selectedKeys);

  const onCavaticaConnectionRequired = () =>
    Modal.confirm({
      type: 'warn',
      title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.title'),
      content: intl.get('screen.dataExploration.tabs.datafiles.cavatica.authWarning.description'),
      okText: 'Connect',
      onOk: () => {
        dispatch(fenceCavaticaActions.setBeginAnalyseConnectionFlag());
        dispatch(connectToFence(FENCE_NAMES.cavatica));
      },
    });

  const onCavaticaUploadLimitReached = () =>
    Modal.error({
      title: intl.get('screen.dataExploration.tabs.datafiles.cavatica.bulkImportLimit.title'),
      content: intl.getHTML(
        'screen.dataExploration.tabs.datafiles.cavatica.bulkImportLimit.description',
        {
          limit: CAVATICA_FILE_BATCH_SIZE,
        },
      ),
      okText: 'Ok',
      cancelText: undefined,
    });

  useEffect(() => {
    if (isConnected && beginAnalyseAfterConnection) {
      onBeginAnalyse();
    }
    // eslint-disable-next-line
  }, [isConnected, beginAnalyseAfterConnection]);

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
        onChange={({ current, pageSize }, _, sorter) =>
          setQueryConfig({
            pageIndex: current!,
            size: pageSize!,
            sort: formatQuerySortList(sorter),
          })
        }
        headerConfig={{
          itemCount: {
            pageIndex: queryConfig.pageIndex,
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
                index: INDEXES.FILE,
                sqon:
                  selectedAllResults || !selectedKeys.length
                    ? sqon
                    : generateSelectionSqon(TAB_IDS.DATA_FILES, selectedKeys),
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
              results={results}
              sqon={getCurrentSqon()}
              selectedAllResults={selectedAllResults}
              type={SetType.FILE}
              selectedKeys={selectedKeys}
            />,
            <Button
              disabled={selectedKeys.length === 0}
              type="primary"
              icon={<CloudUploadOutlined />}
              loading={isInitializingAnalyse}
              onClick={() => {
                if (isConnected) {
                  if (
                    selectedRows.length > CAVATICA_FILE_BATCH_SIZE ||
                    (selectedAllResults && results.total > CAVATICA_FILE_BATCH_SIZE)
                  ) {
                    onCavaticaUploadLimitReached();
                  } else {
                    dispatch(
                      beginAnalyse({
                        sqon: sqon!,
                        fileIds: selectedAllResults ? [] : selectedKeys,
                      }),
                    );
                  }
                } else {
                  onCavaticaConnectionRequired();
                }
              }}
            >
              {intl.get('screen.dataExploration.tabs.datafiles.cavatica.analyseInCavatica')}
            </Button>,
          ],
        }}
        bordered
        size="small"
        pagination={{
          current: queryConfig.pageIndex,
          pageSize: queryConfig.size,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          total: results.total,
          onChange: () => scrollToTop(SCROLL_WRAPPER_ID),
        }}
        dataSource={results.data.map((i) => ({ ...i, key: i.file_id }))}
        dictionary={getProTableDictionary()}
      />
      {isConnected && (
        <>
          <AnalyseModal />
          <CreateProjectModal />
        </>
      )}
    </>
  );
};

export default DataFilesTab;
