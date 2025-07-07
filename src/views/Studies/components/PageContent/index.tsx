import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import ProTable from '@ferlab/ui/core/components/ProTable';
import SummarySumCell from '@ferlab/ui/core/components/ProTable/SummarySumCell';
import {
  ProColumnType,
  TColumnState,
  TColumnStates,
  TProTableSummary,
} from '@ferlab/ui/core/components/ProTable/types';
import { tieBreaker } from '@ferlab/ui/core/components/ProTable/utils';
import useQueryBuilderState, {
  defaultQueryBuilderState,
  setQueryBuilderState,
} from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { FilterOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { generateQuery, isEmptySqon } from '@ferlab/ui/core/data/sqon/utils';
import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { Input, Space, Typography } from 'antd';
import { INDEXES } from 'graphql/constants';
import { useStudies } from 'graphql/studies/actions';
import { IStudyEntity } from 'graphql/studies/models';
import { cloneDeep } from 'lodash';

import { fetchTsvReport } from 'store/report/thunks';
import { useUser } from 'store/user';
import { updateUserConfig } from 'store/user/thunks';
import { formatQuerySortList } from 'utils/helper';
import { getProTableDictionary } from 'utils/translation';

import { resolveSyntheticSqonWithReferences } from '../../../../utils/query';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_QUERY_CONFIG,
  DEFAULT_STUDY_QUERY_SORT,
  STUDIES_REPO_QB_ID,
} from '../../utils/constant';

import styles from './index.module.css';

const { Title } = Typography;

type OwnProps = {
  defaultColumns: ProColumnType<any>[];
  extendedMappingResults?: IExtendedMappingResults;
};

const PAGE_SIZE = 50;

const generateSearchFilter = (search: string) => {
  const query = generateQuery({
    operator: FilterOperators.filter,
    newFilters: [],
  });

  return {
    ...query,
    content: {
      fields: ['search_text'],
      value: `*${search}*`,
    },
  };
};

const generateMultipleQuery = (searchValue: string, activeQuery: ISyntheticSqon) => {
  const searchQuery = generateSearchFilter(searchValue);
  const newQuery: any = activeQuery;
  newQuery.content = [cloneDeep(searchQuery), cloneDeep(activeQuery)];
  return newQuery;
};

const getSummaryColumns = (
  data: IStudyEntity[],
  defaultColumns: ProColumnType<any>[],
  columnsState?: TColumnStates,
) => {
  const summaryColumns: any[] = [];

  (columnsState ?? defaultColumns).forEach((c, index) => {
    let value: React.ReactNode = '';

    if (c.key === 'participant_count') {
      value = (
        <SummarySumCell
          title={intl.get('screen.studies.participants')}
          sum={data.reduce((accumulator, d) => accumulator + d.participant_count, 0)}
        />
      );
    } else if (c.key === 'family_count') {
      value = (
        <SummarySumCell
          title={intl.get('screen.studies.families')}
          sum={data.reduce((accumulator, d) => accumulator + (d.family_count ?? 0), 0)}
        />
      );
    } else if (c.key === 'biospecimen_count') {
      value = (
        <SummarySumCell
          title={intl.get('screen.studies.biospecimens')}
          sum={data.reduce((accumulator, d) => accumulator + d.biospecimen_count, 0)}
        />
      );
    } else if (c.key === 'file_count') {
      value = (
        <SummarySumCell
          title={intl.get('screen.studies.files')}
          sum={data.reduce((accumulator, d) => accumulator + d.file_count, 0)}
        />
      );
    }

    if (columnsState) {
      if ((c as TColumnState).visible) {
        summaryColumns.push({ index, value });
      }
    } else if (!(c as ProColumnType<any>).defaultHidden) {
      summaryColumns.push({ index, value, bordered: false });
    }
  });

  if (summaryColumns.filter((sc) => sc.value != '').length > 0) {
    return summaryColumns as TProTableSummary[];
  }

  return [];
};

const PageContent = ({ defaultColumns = [] }: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const { queryList, activeQuery } = useQueryBuilderState(STUDIES_REPO_QB_ID);
  const [queryConfig, setQueryConfig] = useState({
    ...DEFAULT_QUERY_CONFIG,
    sort: DEFAULT_STUDY_QUERY_SORT,
  });
  const resolvedSqon: ISyntheticSqon = resolveSyntheticSqonWithReferences(
    queryList,
    searchValue.length === 0 ? activeQuery : generateMultipleQuery(searchValue, activeQuery),
  );

  const { loading, total, data } = useStudies({
    first: PAGE_SIZE,
    offset: PAGE_SIZE * (queryConfig.pageIndex - 1),
    sqon: resolveSyntheticSqonWithReferences(
      queryList,
      searchValue.length === 0 ? activeQuery : generateMultipleQuery(searchValue, activeQuery),
    ),
    sort: tieBreaker({
      sort: queryConfig.sort,
      defaultSort: DEFAULT_STUDY_QUERY_SORT,
      field: 'study_code',
      order: queryConfig.operations?.previous ? SortDirection.Desc : SortDirection.Asc,
    }),
  });

  useEffect(() => {
    setQueryConfig((prevQueryConfig) => ({
      ...prevQueryConfig,
      pageIndex: DEFAULT_PAGE_INDEX,
    }));
  }, [queryConfig.pageIndex]);

  const searchPrescription = (value: any) => {
    if (value?.target?.value) {
      setSearchValue(value.target.value);
    } else {
      setSearchValue('');
    }
  };

  const clearFilter = () => {
    searchPrescription(undefined);
    const defaultQBState = defaultQueryBuilderState(STUDIES_REPO_QB_ID);
    setQueryBuilderState(STUDIES_REPO_QB_ID, defaultQBState);
  };

  return (
    <Space direction="vertical" size={16} className={styles.pageContent}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.studies.title')}
      </Title>
      <div>
        <ProLabel className={styles.search} title={intl.get('screen.studies.searchLabel.title')} />
        <Input
          allowClear
          className={styles.search}
          onChange={searchPrescription}
          placeholder={intl.get('screen.studies.searchLabel.placeholder')}
          size="large"
          value={searchValue}
        />
      </div>

      <GridCard
        content={
          <ProTable
            tableId={STUDIES_REPO_QB_ID}
            columns={defaultColumns}
            initialColumnState={userInfo?.config.study?.tables?.study?.columns}
            wrapperClassName={styles.tableWrapper}
            loading={loading}
            showSorterTooltip={false}
            bordered
            onChange={(_pagination, _filter, sorter) => {
              setQueryConfig({
                pageIndex: DEFAULT_PAGE_INDEX,
                size: queryConfig.size!,
                sort: formatQuerySortList(sorter),
              });
            }}
            headerConfig={{
              itemCount: {
                pageIndex: queryConfig.pageIndex,
                pageSize: PAGE_SIZE,
                total,
              },
              enableColumnSort: true,
              onColumnSortChange: (newState) =>
                dispatch(
                  updateUserConfig({
                    study: {
                      tables: {
                        study: {
                          columns: newState,
                        },
                      },
                    },
                  }),
                ),
              enableTableExport: true,
              onTableExportClick: () => {
                dispatch(
                  fetchTsvReport({
                    columnStates: userInfo?.config.study?.tables?.study?.columns,
                    columns: defaultColumns,
                    index: INDEXES.STUDIES,
                    sqon: resolvedSqon,
                  }),
                );
              },
              hasFilter: !isEmptySqon(resolvedSqon),
              clearFilter,
            }}
            size="small"
            dataSource={data.map((i) => ({ ...i, key: i.id }))}
            dictionary={getProTableDictionary()}
            summaryColumns={getSummaryColumns(
              data,
              defaultColumns,
              userInfo?.config.study?.tables?.study?.columns,
            )}
          />
        }
      />
    </Space>
  );
};

export default PageContent;
