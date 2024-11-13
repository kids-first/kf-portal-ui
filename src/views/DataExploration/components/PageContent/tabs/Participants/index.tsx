import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import ColorTag, { ColorTagType } from '@ferlab/ui/core/components/ColorTag';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { PaginationViewPerQuery } from '@ferlab/ui/core/components/ProTable/Pagination/constants';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { resetSearchAfterQueryConfig, tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IArrangerResultsTree } from '@ferlab/ui/core/graphql/types';
import { hydrateResults } from '@ferlab/ui/core/graphql/utils';
import { numberWithCommas } from '@ferlab/ui/core/utils/numberUtils';
import { Button, Dropdown, Menu, Tag, Tooltip } from 'antd';
import { INDEXES } from 'graphql/constants';
import { useParticipants } from 'graphql/participants/actions';
import {
  FamilyType,
  IParticipantDiagnosis,
  IParticipantEntity,
  IParticipantOutcomes,
  IParticipantPhenotype,
  IParticipantStudy,
  ITableParticipantEntity,
} from 'graphql/participants/models';
import { makeUniqueCleanWords } from 'helpers';
import { capitalize } from 'lodash';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
import {
  DATA_EXPLORATION_QB_ID,
  DEFAULT_OFFSET,
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PARTICIPANT_QUERY_SORT,
  DEFAULT_QUERY_CONFIG,
  PARTICIPANTS_SAVED_SETS_FIELD,
  SCROLL_WRAPPER_ID,
} from 'views/DataExploration/utils/constant';
import { areFilesDataTypeValid, mapStudyToPedcBioportal } from 'views/Studies/utils/helper';

import { TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { OntologyTermsWithLinks, OntologyTermsWithLinksFromDiagnoses } from 'components/Cells';
import { ReportType } from 'services/api/reports/models';
import { SetType } from 'services/api/savedSet/models';
import { fetchReport, fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { goToParticipantEntityPage, STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.css';

interface OwnProps {
  sqon?: ISqonGroupFilter;
}

const getDefaultColumns = (): ProColumnType[] => [
  {
    key: 'participant_id',
    title: intl.get('entities.participant.participant_id'),
    dataIndex: 'participant_id',
    sorter: {
      multiple: 1,
    },
    render: (participant_id: string) => (
      <Link to={goToParticipantEntityPage(participant_id)}>{participant_id}</Link>
    ),
  },
  {
    key: 'study.study_code',
    title: intl.get('entities.participant.study'),
    sorter: {
      multiple: 1,
    },
    dataIndex: 'study',
    className: styles.studyIdCell,
    render: (study: IParticipantStudy) =>
      study.study_code ? (
        <Tooltip title={study.study_name}>{study.study_code}</Tooltip>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'study_external_id',
    title: intl.get('entities.participant.dbgap'),
    dataIndex: 'study_external_id',
    render: (study_external_id: string) =>
      study_external_id ? (
        <ExternalLink
          href={`https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=${study_external_id}`}
        >
          {study_external_id}
        </ExternalLink>
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'is_proband',
    title: intl.get('entities.participant.proband'),
    dataIndex: 'is_proband',
    sorter: {
      multiple: 1,
    },
    className: styles.studyIdCell,
    render: (isProband: boolean) => capitalize((!!isProband).toString()),
  },
  {
    key: 'sex',
    title: intl.get('entities.participant.sex'),
    dataIndex: 'sex',
    sorter: {
      multiple: 1,
    },
    render: (sex: string) =>
      sex ? (
        <ColorTag type={ColorTagType.Gender} value={capitalize(sex)} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
  },
  {
    key: 'diagnosis.mondo_display_term',
    title: intl.get('entities.participant.mondo_diagnosis'),
    dataIndex: 'diagnosis',
    className: styles.diagnosisCell,
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) => (
      <OntologyTermsWithLinksFromDiagnoses
        dxs={diagnosis}
        type={'mondo'}
        hrefWithoutCode={'http://purl.obolibrary.org/obo/MONDO_'}
      />
    ),
  },
  {
    key: 'phenotype.hpo_phenotype_observed',
    title: intl.get('entities.participant.hpo_phenotype_observed'),
    dataIndex: 'phenotype',
    className: styles.phenotypeCell,
    render: (phenotype: IArrangerResultsTree<IParticipantPhenotype>) => {
      const phenotypeNames = phenotype?.hits?.edges.map((p) => p.node.hpo_phenotype_observed);
      return (
        <OntologyTermsWithLinks
          terms={phenotypeNames}
          type={'hpo'}
          hrefWithoutCode={'http://purl.obolibrary.org/obo/HP_'}
        />
      );
    },
  },
  {
    key: 'families_id',
    title: intl.get('entities.participant.family_id'),
    dataIndex: 'families_id',
    sorter: {
      multiple: 1,
    },
    render: (families_id: string) => families_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'family_type',
    title: intl.get('entities.participant.family_unit'),
    dataIndex: 'family_type',
    sorter: {
      multiple: 1,
    },
    render: (family_type: FamilyType) =>
      family_type ? <Tag color="cyan">{capitalize(family_type)}</Tag> : TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'pedcbioportal',
    title: intl.get('entities.participant.pedcBioPortal'),
    render: (record: ITableParticipantEntity) => {
      const studyId = mapStudyToPedcBioportal(record.study?.study_code);
      const files = hydrateResults(record?.files?.hits?.edges ?? []);

      if (!studyId || !record?.is_proband || !areFilesDataTypeValid(files)) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }

      return (
        <ExternalLink
          href={`https://pedcbioportal.kidsfirstdrc.org/patient?studyId=${studyId}&caseId=${record?.participant_id}`}
        >
          {record?.participant_id}
        </ExternalLink>
      );
    },
  },
  {
    key: 'nb_biospecimens',
    title: intl.get('entities.participant.nb_biospecimens'),
    sorter: {
      multiple: 1,
    },
    render: (record: ITableParticipantEntity) => {
      const nb_biospecimens = record.nb_biospecimens || 0;

      return nb_biospecimens ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_BIOSPECIMENS}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: [record.participant_id],
                    index: INDEXES.PARTICIPANT,
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
    key: 'nb_files',
    title: intl.get('entities.participant.nb_files'),
    sorter: {
      multiple: 1,
    },
    render: (record: ITableParticipantEntity) =>
      record.nb_files ? (
        <Link
          to={STATIC_ROUTES.DATA_EXPLORATION_DATAFILES}
          onClick={() =>
            addQuery({
              queryBuilderId: DATA_EXPLORATION_QB_ID,
              query: generateQuery({
                newFilters: [
                  generateValueFilter({
                    field: 'participant_id',
                    value: [record.participant_id],
                    index: INDEXES.PARTICIPANT,
                  }),
                ],
              }),
              setAsActive: true,
            })
          }
        >
          {numberWithCommas(record.nb_files)}
        </Link>
      ) : (
        record.nb_files || 0
      ),
  },
  {
    key: 'race',
    title: intl.get('entities.participant.race'),
    dataIndex: 'race',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (race: string) => race || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'ethnicity',
    title: intl.get('entities.participant.ethnicity'),
    dataIndex: 'ethnicity',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (ethnicity: string) => ethnicity || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_id',
    title: intl.get('entities.participant.external_id_tooltip'),
    dataIndex: 'external_id',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (externalId: string) => externalId || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'diagnosis.ncit_display_term',
    title: intl.get('entities.participant.diagnosis_NCIT'),
    dataIndex: 'diagnosis',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) => (
      <OntologyTermsWithLinksFromDiagnoses
        dxs={diagnosis}
        type={'ncit'}
        hrefWithoutCode={
          'https://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&version=22.07d&ns=ncit&code='
        }
      />
    ),
  },
  {
    key: 'diagnosis.source_text',
    title: intl.get('entities.participant.diagnosis_source_text'),
    dataIndex: 'diagnosis',
    defaultHidden: true,
    render: (mondo: IArrangerResultsTree<IParticipantDiagnosis>) => {
      const sourceTexts = mondo?.hits?.edges.map((m) => m.node.source_text);

      if (!sourceTexts || sourceTexts.length === 0) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={makeUniqueCleanWords(sourceTexts)}
          renderItem={(sourceText, index): React.ReactNode => <div key={index}>{sourceText}</div>}
        />
      );
    },
  },
  {
    key: 'outcomes.vital_status',
    title: intl.get('entities.participant.vital_status'),
    dataIndex: 'outcomes',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (outcomes: IArrangerResultsTree<IParticipantOutcomes>) => {
      const hasVitalStatus = outcomes?.hits?.edges?.some((o) => o.node.vital_status);
      if (!hasVitalStatus) return TABLE_EMPTY_PLACE_HOLDER;
      return [...new Set(outcomes?.hits?.edges?.map((o) => o.node.vital_status))];
    },
  },
  {
    key: 'phenotype.hpo_phenotype_not_observed',
    title: intl.get('entities.participant.phenotypes_hpo_not_observed'),
    dataIndex: 'phenotype',
    defaultHidden: true,
    render: (phenotype: IArrangerResultsTree<IParticipantPhenotype>) => {
      const phenotypeNames = phenotype?.hits?.edges.map((p) => p.node.hpo_phenotype_not_observed);
      return (
        <OntologyTermsWithLinks
          terms={phenotypeNames}
          type={'hpo'}
          hrefWithoutCode={'https://hpo.jax.org/app/browse/term/HP:'}
        />
      );
    },
  },
  {
    key: 'phenotype.source_text',
    title: intl.get('entities.participant.source_text_phenotype'),
    dataIndex: 'phenotype',
    defaultHidden: true,
    render: (phenotype: IArrangerResultsTree<IParticipantPhenotype>) => {
      const phenotypeNames = phenotype?.hits?.edges.map((p) => p.node.source_text);
      const hasPhenotypeName = !!phenotypeNames?.filter((name) => name).length;
      if (!phenotypeNames || !hasPhenotypeName) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={makeUniqueCleanWords(phenotypeNames)}
          renderItem={(hpo_id_phenotype, index): React.ReactNode =>
            hpo_id_phenotype ? (
              <div key={index}>{capitalize(hpo_id_phenotype)}</div>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            )
          }
        />
      );
    },
  },
];

const ParticipantsTab = ({ sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const [pageIndex, setPageIndex] = useState(DEFAULT_PAGE_INDEX);
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const [selectedAllResults, setSelectedAllResults] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<IParticipantEntity[]>([]);
  const [queryConfig, setQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    sort: DEFAULT_PARTICIPANT_QUERY_SORT,
    size:
      userInfo?.config?.data_exploration?.tables?.participants?.viewPerQuery || DEFAULT_PAGE_SIZE,
  });
  const results = useParticipants(
    {
      first: queryConfig.size,
      offset: DEFAULT_OFFSET,
      searchAfter: queryConfig.searchAfter,
      sqon,
      sort: tieBreaker({
        sort: queryConfig.sort,
        defaultSort: DEFAULT_PARTICIPANT_QUERY_SORT,
        field: 'participant_id',
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
              field: PARTICIPANTS_SAVED_SETS_FIELD,
              index: INDEXES.PARTICIPANT,
              value: selectedRows.map((row) => row[PARTICIPANTS_SAVED_SETS_FIELD]),
            }),
          ],
        });

  const menu = (
    <Menu
      onClick={(e) =>
        dispatch(
          fetchReport({
            data: {
              sqon: getCurrentSqon(),
              name: e.key,
            },
          }),
        )
      }
      items={[
        {
          key: ReportType.CLINICAL_DATA,
          label: 'Selected participants',
        },
        {
          key: ReportType.CLINICAL_DATA_FAM,
          label: 'Selected participants & families',
        },
      ]}
    />
  );

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
      setSelectedRows([]);
    }
    resetSearchAfterQueryConfig(
      {
        ...DEFAULT_QUERY_CONFIG,
        sort: DEFAULT_PARTICIPANT_QUERY_SORT,
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
    <ProTable<ITableParticipantEntity>
      tableId="participants_table"
      columns={getDefaultColumns()}
      wrapperClassName={styles.participantTabWrapper}
      loading={results.loading}
      initialColumnState={userInfo?.config.data_exploration?.tables?.participants?.columns}
      enableRowSelection={true}
      initialSelectedKey={selectedKeys}
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
        onColumnSortChange: (newState) =>
          dispatch(
            updateUserConfig({
              data_exploration: {
                tables: {
                  participants: {
                    columns: newState,
                  },
                },
              },
            }),
          ),
        onTableExportClick: () =>
          dispatch(
            fetchTsvReport({
              columnStates: userInfo?.config.data_exploration?.tables?.participants?.columns,
              columns: getDefaultColumns(),
              index: INDEXES.PARTICIPANT,
              sqon: getCurrentSqon(),
            }),
          ),
        onSelectAllResultsChange: setSelectedAllResults,
        onSelectedRowsChange: (keys, rows) => {
          setSelectedKeys(keys);
          setSelectedRows(rows);
        },
        extra: [
          <SetsManagementDropdown
            idField="fhir_id"
            results={results}
            selectedKeys={selectedKeys}
            selectedAllResults={selectedAllResults}
            sqon={getCurrentSqon()}
            type={SetType.PARTICIPANT}
            key="participant-set-management"
          />,
          <Tooltip
            title={
              selectedKeys.length === 0
                ? intl.get('screen.dataExploration.itemSelectionTooltip')
                : undefined
            }
          >
            <div>
              <Dropdown
                disabled={selectedKeys.length === 0}
                overlay={menu}
                placement="bottomLeft"
                key={'download-clinical-data-dropdown'}
              >
                <Button icon={<DownloadOutlined />}>
                  {intl.get('screen.dataExploration.tabs.participants.downloadData')}
                </Button>
              </Dropdown>
            </div>
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
                  participants: {
                    ...userInfo?.config.data_exploration?.tables?.participants,
                    viewPerQuery,
                  },
                },
              },
            }),
          );
        },
        defaultViewPerQuery: queryConfig.size,
      }}
      dataSource={results.data.map((i) => ({ ...i, key: i.participant_id }))}
      dictionary={getProTableDictionary()}
    />
  );
};

export default ParticipantsTab;
