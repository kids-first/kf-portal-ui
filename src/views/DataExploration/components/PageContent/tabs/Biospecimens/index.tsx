import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
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
import { Button, Tooltip } from 'antd';
import { useBiospecimen } from 'graphql/biospecimens/actions';
import { IBiospecimenEntity, Status } from 'graphql/biospecimens/models';
import { INDEXES } from 'graphql/constants';
import { IParticipantEntity } from 'graphql/participants/models';
import { IStudyEntity } from 'graphql/studies/models';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
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
import CollectionIdLink from 'views/ParticipantEntity/BiospecimenTable/CollectionIdLink';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import AgeCell from 'components/AgeCell';
import { ReportType } from 'services/api/reports/models';
import { SetType } from 'services/api/savedSet/models';
import { fetchReport, fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { goToParticipantEntityPage, STATIC_ROUTES } from 'utils/routes';
import { mergeBiosDiagnosesSpecificField } from 'utils/tables';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.scss';

interface OwnProps {
  sqon?: ISqonGroupFilter;
}

const getDefaultColumns = (): ProColumnType<any>[] => [
  {
    key: 'sample_id',
    title: intl.get('entities.biospecimen.sample_id'),
    sorter: { multiple: 1 },
    render: (record: IBiospecimenEntity) => record?.sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'study.study_code',
    title: intl.get('entities.participant.study'),
    dataIndex: 'study',
    sorter: { multiple: 1 },
    render: (study: IStudyEntity) =>
      <Tooltip title={study.study_name}>{study.study_code}</Tooltip> || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sample_type',
    title: intl.get('entities.biospecimen.sample_type'),
    dataIndex: 'sample_type',
    sorter: { multiple: 1 },
    render: (sample_type: string) => sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'parent_sample_id',
    title: intl.get('entities.biospecimen.parent_sample_id'),
    dataIndex: 'parent_sample_id',
    sorter: { multiple: 1 },
    render: (parent_sample_id) => parent_sample_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'parent_sample_type',
    title: intl.get('entities.biospecimen.parent_sample_type'),
    dataIndex: 'parent_sample_type',
    sorter: { multiple: 1 },
    render: (parent_sample_type) => parent_sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'participant.participant_id',
    title: intl.get('entities.participant.participant_id'),
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
    title: intl.get('entities.biospecimen.collection_id'),
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
    title: intl.get('entities.biospecimen.collection_sample_type'),
    dataIndex: 'collection_sample_type',
    render: (collection_sample_type) => collection_sample_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'age_at_biospecimen_collection',
    title: intl.get('entities.participant.age'),
    tooltip: intl.get('entities.biospecimen.age_tooltip'),
    dataIndex: 'age_at_biospecimen_collection',
    render: (age_at_biospecimen_collection) => (
      <AgeCell ageInDays={age_at_biospecimen_collection} />
    ),
  },
  {
    key: 'diagnosis_mondo',
    title: intl.get('entities.biospecimen.diagnoses.diagnosis_mondo'),
    render: (record: IBiospecimenEntity) =>
      mergeBiosDiagnosesSpecificField(record, 'diagnosis_mondo'),
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
    title: intl.get('entities.biospecimen.sample_availabilty'),
    dataIndex: 'status',
    render: (status: string) =>
      status === Status.AVAILABLE ? intl.get('global.yes') : intl.get('global.no'),
  },
  {
    key: 'nb_files',
    title: intl.get('entities.file.files'),
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
    key: 'collection_ncit_anatomy_site_id',
    title: intl.get('entities.biospecimen.anatomical_site_NCIT'),
    dataIndex: 'collection_ncit_anatomy_site_id',
    defaultHidden: true,
    render: (collection_ncit_anatomy_site_id) =>
      collection_ncit_anatomy_site_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'collection_anatomy_site',
    title: intl.get('entities.biospecimen.anatomical_site'),
    dataIndex: 'collection_anatomy_site',
    defaultHidden: true,
    render: (anatomy_site) => anatomy_site || TABLE_EMPTY_PLACE_HOLDER,
  },
  // {
  //   key: 'ncit_id_tissue_type',
  //   title: intl.get('entities.biospecimen.ncit_id_tissue_type'),
  //   dataIndex: 'ncit_id_tissue_type',
  //   defaultHidden: true,
  //   render: (ncit_id_tissue_type) => ncit_id_tissue_type || TABLE_EMPTY_PLACE_HOLDER,
  // },
  // {
  //   key: 'tissue_type_source_text',
  //   title: intl.get('entities.biospecimen.tissue_type_source_text'),
  //   dataIndex: 'tissue_type_source_text',
  //   defaultHidden: true,
  //   render: (tissue_type_source_text) => tissue_type_source_text || TABLE_EMPTY_PLACE_HOLDER,
  // },
  {
    key: 'diagnosis_ncit',
    title: intl.get('entities.biospecimen.diagnoses.diagnosis_ncit'),
    defaultHidden: true,
    render: (record: IBiospecimenEntity) =>
      mergeBiosDiagnosesSpecificField(record, 'diagnosis_ncit'),
  },
  {
    key: 'source_text',
    title: intl.get('entities.biospecimen.diagnoses.source_text'),
    defaultHidden: true,
    render: (record: IBiospecimenEntity) => mergeBiosDiagnosesSpecificField(record, 'source_text'),
  },
  {
    key: 'source_text_tumor_location',
    title: intl.get('entities.biospecimen.diagnoses.source_text_tumor_location'),
    defaultHidden: true,
    render: (record: IBiospecimenEntity) =>
      mergeBiosDiagnosesSpecificField(record, 'source_text_tumor_location'),
  },
  {
    key: 'dbgap_consent_code',
    title: intl.get('entities.biospecimen.dbgap_consent_code'),
    dataIndex: 'dbgap_consent_code',
    defaultHidden: true,
    render: (dbgap_consent_code) => dbgap_consent_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'consent_type',
    title: intl.get('entities.biospecimen.consent_type'),
    dataIndex: 'consent_type',
    defaultHidden: true,
    render: (consent_type) => consent_type || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'collection_method_of_sample_procurement',
    title: intl.get('entities.biospecimen.collection_method_of_sample_procurement'),
    dataIndex: 'collection_method_of_sample_procurement',
    defaultHidden: true,
    render: (collection_method_of_sample_procurement) =>
      collection_method_of_sample_procurement || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'source_text_tumor_descriptor',
    title: intl.get('entities.biospecimen.diagnoses.source_text_tumor_descriptor'),
    defaultHidden: true,
    render: (record: IBiospecimenEntity) =>
      mergeBiosDiagnosesSpecificField(record, 'source_text_tumor_descriptor'),
  },
  {
    key: 'volume',
    title: intl.get('entities.biospecimen.volume'),
    dataIndex: 'volume',
    defaultHidden: true,
    render: (volume) => volume || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'volume_unit',
    title: intl.get('entities.biospecimen.volume_unit'),
    dataIndex: 'volume_unit',
    defaultHidden: true,
    render: (volume_unit) => volume_unit || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'participant.external_id',
    title: intl.get('entities.biospecimen.external_pt_id'),
    dataIndex: 'participant',
    defaultHidden: true,
    render: (participant: IParticipantEntity) =>
      participant?.external_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_sample_id',
    title: intl.get('entities.biospecimen.external_sample_id'),
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
          <Tooltip
            title={
              selectedKeys.length === 0
                ? intl.get('screen.dataExploration.itemSelectionTooltip')
                : undefined
            }
          >
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
              {intl.get('screen.dataExploration.tabs.biospecimens.downloadData')}
            </Button>
          </Tooltip>,
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
