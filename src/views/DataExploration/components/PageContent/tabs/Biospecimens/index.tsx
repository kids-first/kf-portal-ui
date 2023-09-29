import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { resetSearchAfterQueryConfig, tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { BooleanOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';
import { Button } from 'antd';
import { useBiospecimen } from 'graphql/biospecimens/actions';
import { IBiospecimenEntity } from 'graphql/biospecimens/models';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown2';
import {
  BIOSPECIMENS_SAVED_SETS_FIELD,
  DATA_EXPLORATION_QB_ID,
  DEFAULT_BIOSPECIMEN_QUERY_SORT,
  DEFAULT_OFFSET,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  SCROLL_WRAPPER_ID,
} from 'views/DataExploration/utils/constant';
import AgeCell from 'views/ParticipantEntity/AgeCell';
import CollectionIdLink from 'views/ParticipantEntity/BiospecimenTable/CollectionIdLink';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { ReportType } from 'services/api/reports/models';
import { SetType } from 'services/api/savedSet/models';
import { fetchReport, fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { goToParticipantEntityPage, STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.scss';

interface OwnProps {
  sqon?: ISqonGroupFilter;
}

const getDefaultColumns = (): ProColumnType<any>[] => [
  {
    key: 'sample_id',
    title: 'Sample ID',
    sorter: { multiple: 1 },
    render: (record: IBiospecimenEntity) =>
      record?.sample_id && record.participant?.participant_id ? (
        <Link to={goToParticipantEntityPage(record.participant.participant_id)}>
          {record.sample_id}
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'study.study_code',
    title: 'Study',
    dataIndex: ['study', 'study_code'],
    sorter: { multiple: 1 },
    render: (study_code) => study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sample_type',
    title: 'Sample Type',
    dataIndex: 'sample_type',
    sorter: { multiple: 1 },
    render: (sample_type: string) => sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'parent_sample_id',
    title: 'Parent Sample ID',
    dataIndex: 'parent_sample_id',
    sorter: { multiple: 1 },
    render: (parent_sample_id) => parent_sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'parent_sample_type',
    title: 'Parent Sample Type',
    dataIndex: 'parent_sample_type',
    sorter: { multiple: 1 },
    render: (parent_sample_type) => parent_sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'participant.participant_id',
    title: 'Participant ID',
    sorter: { multiple: 1 },
    render: (record: IBiospecimenEntity) =>
      record?.participant?.participant_id ? (
        <Link to={goToParticipantEntityPage(record.participant.participant_id)}>
          {record.participant.participant_id}
        </Link>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'collection_sample_id',
    title: 'Collection ID',
    dataIndex: 'collection_sample_id',
    render: (collection_sample_id) =>
      collection_sample_id ? (
        <CollectionIdLink collectionId={collection_sample_id} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'collection_sample_type',
    title: 'Collection Sample Type',
    dataIndex: 'collection_sample_type',
    render: (collection_sample_type) => collection_sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'age_at_biospecimen_collection',
    title: 'Age',
    tooltip: 'Age at Biospecimen Collection (days)',
    dataIndex: 'age_at_biospecimen_collection',
    render: (age_at_biospecimen_collection) =>
      age_at_biospecimen_collection ? (
        <AgeCell ageInDays={age_at_biospecimen_collection} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  // TODO back implementation needed
  // {
  //   key: 'diagnosis.mondo_id_diagnosis',
  //   title: 'Histological Diagnosis (MONDO)',
  //   dataIndex: ['diagnosis', 'mondo_id_diagnosis'],
  //   render: (mondo_id_diagnosis: string) =>
  //     mondo_id_diagnosis ? (
  //       <ExternalLink
  //         href={`http://purl.obolibrary.org/obo/MONDO_${mondo_id_diagnosis.split(':')[1]}`}
  //       >
  //         {mondo_id_diagnosis}
  //       </ExternalLink>
  //     ) : (
  //       TABLE_EMPTY_PLACE_HOLDER
  //     ),
  // },
  {
    key: 'status',
    title: 'Sample Availability',
    dataIndex: 'status',
    render: (status) => status || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'nb_files',
    title: 'Files',
    sorter: { multiple: 1 },
    render: (record: IBiospecimenEntity) => {
      const nbFiles = record?.nb_files || 0;
      return nbFiles ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                operator: BooleanOperators.or,
                newFilters: [
                  generateValueFilter({
                    field: 'sample_id',
                    value: [record.sample_id],
                    index: INDEXES.BIOSPECIMEN,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {numberWithCommas(nbFiles)}
        </Link>
      ) : (
        nbFiles
      );
    },
  },
  {
    key: 'participant.external_id',
    title: 'External Participant ID',
    dataIndex: 'participant',
    defaultHidden: true,
    render: (participant: IParticipantEntity) =>
      participant?.external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'ncit_anatomy_site_id',
    title: 'Anatomical Site (NCIT)',
    dataIndex: 'ncit_anatomy_site_id',
    defaultHidden: true,
    render: (ncit_anatomy_site_id) => ncit_anatomy_site_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'anatomy_site',
    title: 'Anatomical Site (Source Text)',
    dataIndex: 'anatomy_site',
    defaultHidden: true,
    render: (anatomy_site) => anatomy_site || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'ncit_id_tissue_type',
    title: 'Tissue Type (NCIT)',
    dataIndex: 'ncit_id_tissue_type',
    defaultHidden: true,
    render: (ncit_id_tissue_type) => ncit_id_tissue_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'tissue_type_source_text',
    title: 'Tissue Type (Source Text)',
    dataIndex: 'tissue_type_source_text',
    defaultHidden: true,
    render: (tissue_type_source_text) => tissue_type_source_text || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'dbgap_consent_code',
    title: 'dbGaP Consent Code',
    dataIndex: 'dbgap_consent_code',
    defaultHidden: true,
    render: (dbgap_consent_code) => dbgap_consent_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'consent_type',
    title: 'Consent Type',
    dataIndex: 'consent_type',
    defaultHidden: true,
    render: (consent_type) => consent_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'method_of_sample_procurement',
    title: 'Method of Sample Procurement',
    dataIndex: 'method_of_sample_procurement',
    defaultHidden: true,
    render: (method_of_sample_procurement) =>
      method_of_sample_procurement || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'volume',
    title: 'Volume',
    dataIndex: 'volume',
    defaultHidden: true,
    render: (volume) => volume || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'volume_unit',
    title: 'Volume Unit',
    dataIndex: 'volume_unit',
    defaultHidden: true,
    render: (volume_unit) => volume_unit || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_sample_id',
    title: 'External Sample ID',
    dataIndex: 'external_sample_id',
    defaultHidden: true,
    render: (external_sample_id) => external_sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
];

const BioSpecimenTab = ({ sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const [selectedAllResults, setSelectedAllResults] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<IBiospecimenEntity[]>([]);
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const [queryConfig, setQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    sort: DEFAULT_BIOSPECIMEN_QUERY_SORT,
    size:
      userInfo?.config?.data_exploration?.tables?.biospecimens?.viewPerQuery || DEFAULT_PAGE_SIZE,
  });
  const results = useBiospecimen(
    {
      first: queryConfig.size,
      offset: DEFAULT_OFFSET,
      searchAfter: queryConfig.searchAfter,
      sqon,
      sort: tieBreaker({
        sort: queryConfig.sort,
        defaultSort: DEFAULT_BIOSPECIMEN_QUERY_SORT,
        field: 'sample_id',
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
              field: BIOSPECIMENS_SAVED_SETS_FIELD,
              index: INDEXES.BIOSPECIMEN,
              value: selectedRows.map((row) => row[BIOSPECIMENS_SAVED_SETS_FIELD]),
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
        sort: DEFAULT_BIOSPECIMEN_QUERY_SORT,
        size:
          userInfo?.config?.data_exploration?.tables?.biospecimens?.viewPerQuery ||
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
    <ProTable
      tableId="biospecimen_table"
      columns={getDefaultColumns()}
      wrapperClassName={styles.biospecimenTabWrapper}
      loading={results.loading}
      initialColumnState={userInfo?.config.data_exploration?.tables?.biospecimens?.columns}
      enableRowSelection={true}
      showSorterTooltip={false}
      initialSelectedKey={selectedKeys}
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
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              data_exploration: {
                tables: {
                  biospecimens: {
                    columns: newState,
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            fetchTsvReport({
              columnStates: userInfo?.config.data_exploration?.tables?.biospecimens?.columns,
              columns: getDefaultColumns(),
              index: INDEXES.BIOSPECIMEN,
              sqon: getCurrentSqon(),
            }),
          ),
        extra: [
          <SetsManagementDropdown
            key={INDEXES.BIOSPECIMEN}
            idField="fhir_id"
            results={results}
            sqon={getCurrentSqon()}
            selectedAllResults={selectedAllResults}
            type={SetType.BIOSPECIMEN}
            selectedKeys={selectedKeys}
          />,
          <Button
            key="biospecimen-download"
            icon={<DownloadOutlined />}
            onClick={() =>
              dispatch(
                fetchReport({
                  data: {
                    sqon: getCurrentSqon(),
                    name: ReportType.BIOSEPCIMEN_DATA,
                  },
                }),
              )
            }
            disabled={selectedKeys.length === 0}
          >
            Download sample data
          </Button>,
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
                  biospecimens: {
                    ...userInfo?.config.data_exploration?.tables?.biospecimens,
                    viewPerQuery,
                  },
                },
              },
            }),
          );
        },
        defaultViewPerQuery: queryConfig.size,
      }}
      dataSource={results.data.map((i) => ({ ...i, key: i.id }))}
      dictionary={getProTableDictionary()}
    />
  );
};

export default BioSpecimenTab;
