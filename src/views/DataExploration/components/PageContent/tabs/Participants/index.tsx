import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { DownloadOutlined } from '@ant-design/icons';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import ProTable from '@ferlab/ui/core/components/ProTable';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import useQueryBuilderState, {
  addQuery,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, generateValueFilter } from '@ferlab/ui/core/data/sqon/utils';
import {
  IArrangerResultsTree,
  IQueryConfig,
  IQueryResults,
  TQueryConfigCb,
} from '@ferlab/ui/core/graphql/types';
import { Button, Dropdown, Menu, Tag } from 'antd';
import { INDEXES } from 'graphql/constants';
import {
  IParticipantDiagnosis,
  IParticipantEntity,
  IParticipantObservedPhenotype,
  IParticipantOutcomes,
  IParticipantPhenotype,
  IParticipantStudy,
  ITableParticipantEntity,
} from 'graphql/participants/models';
import { capitalize } from 'lodash';
import SetsManagementDropdown from 'views/DataExploration/components/SetsManagementDropdown';
import {
  DATA_EXPLORATION_QB_ID,
  DEFAULT_PAGE_SIZE,
  SCROLL_WRAPPER_ID,
  PARTICIPANTS_SAVED_SETS_FIELD,
} from 'views/DataExploration/utils/constant';
import {
  extractMondoTitleAndCode,
  extractPhenotypeTitleAndCode,
} from 'views/DataExploration/utils/helper';

import { SEX, TABLE_EMPTY_PLACE_HOLDER } from 'common/constants';
import { ReportType } from 'services/api/reports/models';
import { SetType } from 'services/api/savedSet/models';
import { fetchReport, fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { STATIC_ROUTES } from 'utils/routes';
import { getProTableDictionary } from 'utils/translation';

import styles from './index.module.scss';

interface OwnProps {
  results: IQueryResults<IParticipantEntity[]>;
  setQueryConfig: TQueryConfigCb;
  queryConfig: IQueryConfig;
  sqon?: ISqonGroupFilter;
}

const defaultColumns: ProColumnType[] = [
  {
    key: 'participant_id',
    title: 'Participant ID',
    dataIndex: 'participant_id',
    sorter: {
      multiple: 1,
    },
  },
  {
    key: 'study.study_code',
    title: 'Study',
    sorter: {
      multiple: 1,
    },
    dataIndex: 'study',
    className: styles.studyIdCell,
    render: (study: IParticipantStudy) => study.study_code || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'study_external_id',
    title: 'dbGaP',
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
    title: 'Proband',
    dataIndex: 'is_proband',
    sorter: {
      multiple: 1,
    },
    className: styles.studyIdCell,
    render: (isProband: boolean) => (isProband ? `true` : `false`), //|| TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'sex',
    title: 'Sex',
    dataIndex: 'sex',
    sorter: {
      multiple: 1,
    },
    render: (sex: string) => (
      <Tag
        color={
          sex?.toLowerCase() === SEX.FEMALE
            ? 'magenta'
            : sex?.toLowerCase() === SEX.MALE
            ? 'geekblue'
            : ''
        }
      >
        {capitalize(sex)}
      </Tag>
    ),
  },
  {
    key: 'diagnosis_category',
    title: 'Diagnosis Category',
    dataIndex: 'diagnosis',
    sorter: {
      multiple: 1,
    },
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'diagnosis.mondo_id_diagnosis',
    title: 'Diagnosis (MONDO)',
    dataIndex: 'diagnosis',
    className: styles.diagnosisCell,
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) => {
      const mondoNames = diagnosis?.hits?.edges.map((m) => m.node.mondo_id_diagnosis);
      if (!mondoNames || mondoNames.length === 0) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={mondoNames}
          renderItem={(mondo_id, index): React.ReactNode => {
            const mondoInfo = extractMondoTitleAndCode(mondo_id);
            return mondoInfo ? (
              <div key={index}>
                {capitalize(mondoInfo.title)} (MONDO:{' '}
                <ExternalLink
                  href={`https://monarchinitiative.org/disease/MONDO:${mondoInfo.code}`}
                >
                  {mondoInfo.code}
                </ExternalLink>
                )
              </div>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            );
          }}
        />
      );
    },
  },
  {
    key: 'phenotype.hpo_phenotype_observed',
    title: 'Observed Phenotype (HPO)',
    dataIndex: 'phenotype',
    className: styles.phenotypeCell,
    render: (phenotype: IArrangerResultsTree<IParticipantPhenotype>) => {
      const phenotypeNames = phenotype?.hits?.edges.map((p) => p.node.hpo_phenotype_observed);
      if (!phenotypeNames || phenotypeNames.length === 0) {
        return TABLE_EMPTY_PLACE_HOLDER;
      }
      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={1}
          dataSource={phenotypeNames}
          renderItem={(hpo_id_phenotype, index): React.ReactNode => {
            const phenotypeInfo = extractPhenotypeTitleAndCode(hpo_id_phenotype);

            return phenotypeInfo ? (
              <div key={index}>
                {capitalize(phenotypeInfo.title)} (HP:{' '}
                <ExternalLink href={`https://hpo.jax.org/app/browse/term/HP:${phenotypeInfo.code}`}>
                  {phenotypeInfo.code}
                </ExternalLink>
                )
              </div>
            ) : (
              TABLE_EMPTY_PLACE_HOLDER
            );
          }}
        />
      );
    },
  },
  {
    key: 'families_id',
    title: 'Family ID',
    dataIndex: 'families_id',
    sorter: {
      multiple: 1,
    },
    render: (families_id: string) => families_id || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'family_composition',
    title: 'Family Composition',
    dataIndex: 'family_composition',
    sorter: {
      multiple: 1,
    },
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'pedcbioportal',
    title: 'PedcBioPortal',
    dataIndex: 'pedcbioportal',
    sorter: {
      multiple: 1,
    },
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'nb_biospecimens',
    title: 'Biospecimens',
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
          {nb_biospecimens}
        </Link>
      ) : (
        nb_biospecimens
      );
    },
  },
  {
    key: 'nb_files',
    title: 'Files',
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
          {record.nb_files}
        </Link>
      ) : (
        record.nb_files || 0
      ),
  },
  {
    key: 'race',
    title: 'Race',
    dataIndex: 'race',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (race: string) => race || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'ethnicity',
    title: 'Ethnicity',
    dataIndex: 'ethnicity',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (ethnicity: string) => ethnicity || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'external_id',
    title: 'Participant External ID',
    dataIndex: 'external_id',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (externalId: string) => externalId || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'diagnosis.ncit_id_diagnosis',
    title: 'Diagnosis (NCIT)',
    dataIndex: 'diagnosis',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) =>
      diagnosis?.hits?.edges
        ?.reduce<string[]>((ncitIds, diagnosis) => {
          diagnosis.node.ncit_id_diagnosis && ncitIds.push(diagnosis.node.ncit_id_diagnosis);
          return ncitIds;
        }, [])
        ?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'diagnosis.source_text',
    title: 'Diagnosis (Source Text)',
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
          dataSource={sourceTexts}
          renderItem={(sourceText, index): React.ReactNode => <div key={index}>{sourceText}</div>}
        />
      );
    },
  },
  {
    key: 'clinical_status',
    title: 'Clinical Status',
    dataIndex: 'diagnosis',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) =>
      diagnosis?.hits?.edges?.map((dn) => dn.node.affected_status) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'disease_related',
    title: 'Disease Related',
    dataIndex: 'outcomes',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'outcomes.vital_status',
    title: 'Vital Status',
    dataIndex: 'outcomes',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (outcomes: IArrangerResultsTree<IParticipantOutcomes>) =>
      outcomes?.hits?.edges?.map((o) => o.node.vital_status) || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'phenotypes_hpo_not_observed',
    title: 'Not Observed Phenotype (HPO)',
    dataIndex: 'phenotype',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (_: IArrangerResultsTree<IParticipantPhenotype>) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'source_text_phenotype',
    title: 'Observed Phenotype (Source Text)',
    dataIndex: 'phenotype',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (_) => TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'diagnosis.age_at_event_days',
    title: 'Age at Diagnosis',
    dataIndex: 'diagnosis',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (diagnosis: IArrangerResultsTree<IParticipantDiagnosis>) =>
      diagnosis?.hits?.edges
        ?.filter((e) => e.node?.age_at_event_days !== null)
        .map((e) => e.node?.age_at_event_days)
        ?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },
  {
    key: 'outcomes.age_at_event_days.value',
    title: 'Age at Outcome',
    dataIndex: 'outcomes',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (outcomes: IArrangerResultsTree<IParticipantOutcomes>) =>
      outcomes?.hits?.edges
        ?.filter((e) => e.node.age_at_event_days?.value)
        ?.map((e) => e.node.age_at_event_days.value)
        ?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },

  {
    key: 'observed_phenotype.age_at_event_days',
    title: 'Age at Observed Phenotype',
    dataIndex: 'observed_phenotype',
    defaultHidden: true,
    sorter: {
      multiple: 1,
    },
    render: (observed_phenotype: IArrangerResultsTree<IParticipantObservedPhenotype>) =>
      observed_phenotype?.hits?.edges
        ?.reduce<number[][]>((ages, phenotype) => {
          phenotype.node.age_at_event_days.length && ages.push(phenotype.node.age_at_event_days);
          return ages;
        }, [])
        ?.join(', ') || TABLE_EMPTY_PLACE_HOLDER,
  },
];

const ParticipantsTab = ({ results, setQueryConfig, queryConfig, sqon }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { activeQuery } = useQueryBuilderState(DATA_EXPLORATION_QB_ID);
  const [selectedAllResults, setSelectedAllResults] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<IParticipantEntity[]>([]);

  useEffect(() => {
    if (selectedKeys.length) {
      setSelectedKeys([]);
      setSelectedRows([]);
    }
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

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

  return (
    <ProTable<ITableParticipantEntity>
      tableId="participants_table"
      columns={defaultColumns}
      wrapperClassName={styles.participantTabWrapper}
      loading={results.loading}
      initialColumnState={userInfo?.config.data_exploration?.tables?.participants?.columns}
      enableRowSelection={true}
      initialSelectedKey={selectedKeys}
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
              columns: defaultColumns,
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
          <Dropdown
            disabled={selectedKeys.length === 0}
            overlay={menu}
            placement="bottomLeft"
            key={'download-clinical-data-dropdown'}
          >
            <Button icon={<DownloadOutlined />}>Download clinical data</Button>
          </Dropdown>,
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
      dataSource={results.data.map((i) => ({ ...i, key: i.participant_id }))}
      dictionary={getProTableDictionary()}
    />
  );
};

export default ParticipantsTab;
