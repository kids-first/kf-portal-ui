import ProTable from '@ferlab/ui/core/components/ProTable';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { ReadOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { getProTableDictionary } from 'utils/translation';
import intl from 'react-intl-universal';
import { isEmptySqon, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { combineExtendedMappings } from 'utils/fieldMapper';

import styles from './index.module.scss';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { getQueryBuilderDictionary } from 'utils/translation';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  SCROLL_WRAPPER_ID,
  STUDIES_REPO_QB_ID,
} from '../../utils/constant';
import { useEffect, useState } from 'react';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { useStudies } from 'graphql/studies/actions';
import { formatQuerySortList, scrollToTop } from 'utils/helper';
import { useDispatch } from 'react-redux';
import { fetchTsvReport } from 'store/report/thunks';
import { INDEXES } from 'graphql/constants';
import { useUser } from 'store/user';
import { ArrangerApi } from 'services/api/arranger';
import { IStudiesResultTree } from 'graphql/studies/models';
import { GET_STUDY_COUNT } from 'graphql/studies/queries';
import { TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import { updateUserConfig } from 'store/user/thunks';

const { Title } = Typography;

type OwnProps = {
  defaultColumns: ProColumnType<any>[];
  extendedMappingResults?: IExtendedMappingResults;
};

const PageContent = ({
  defaultColumns = [],
  extendedMappingResults = { data: [], loading: false },
}: OwnProps) => {
  const dispatch = useDispatch();
  const { userInfo } = useUser();
  const { queryList, activeQuery } = useQueryBuilderState(STUDIES_REPO_QB_ID);
  const [queryConfig, setQueryConfig] = useState(DEFAULT_QUERY_CONFIG);
  const resolvedSqon = resolveSyntheticSqon(queryList, activeQuery);

  const { loading, total, data } = useStudies({
    first: queryConfig.size,
    offset: queryConfig.size * (queryConfig.pageIndex - 1),
    sqon: resolvedSqon,
  });

  useEffect(() => {
    setQueryConfig({
      ...queryConfig,
      pageIndex: DEFAULT_PAGE_INDEX,
    });
    // eslint-disable-next-line
  }, [JSON.stringify(activeQuery)]);

  const facetTransResolver = (key: string) => {
    const title = intl.get(`facets.${key}`);
    return title
      ? title
      : combineExtendedMappings([extendedMappingResults])?.data?.find(
          (mapping: TExtendedMapping) => key === mapping.field,
        )?.displayName || key;
  };

  return (
    <Space direction="vertical" size={16} className={styles.pageContent}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.studies.title')}
      </Title>
      <QueryBuilder
        id={STUDIES_REPO_QB_ID}
        className="studies-repo__query-builder"
        headerConfig={{
          showHeader: false,
          showTools: false,
          defaultTitle: intl.get('components.querybuilder.defaultTitle'),
          options: {
            enableEditTitle: true,
            enableDuplicate: true,
            enableFavoriteFilter: false,
          },
        }}
        enableCombine
        IconTotal={<ReadOutlined size={18} />}
        currentQuery={isEmptySqon(activeQuery) ? {} : activeQuery}
        total={total}
        dictionary={getQueryBuilderDictionary(facetTransResolver)}
        getResolvedQueryForCount={(sqon) => resolveSyntheticSqon(queryList, sqon)}
        fetchQueryCount={async (sqon) => {
          const { data } = await ArrangerApi.graphqlRequest<{ data: IStudiesResultTree }>({
            query: GET_STUDY_COUNT.loc?.source.body,
            variables: {
              sqon: resolveSyntheticSqon(queryList, sqon),
            },
          });

          return data?.data?.study.hits.total ?? 0;
        }}
      />
      <GridCard
        content={
          <ProTable
            tableId={STUDIES_REPO_QB_ID}
            columns={defaultColumns}
            initialColumnState={userInfo?.config.study?.tables?.study?.columns}
            wrapperClassName={styles.tableWrapper}
            loading={loading}
            bordered
            onChange={({ current, pageSize }, _, sorter) => {
              setQueryConfig({
                pageIndex: current!,
                size: pageSize!,
                sort: formatQuerySortList(sorter),
              });
            }}
            headerConfig={{
              itemCount: {
                pageIndex: queryConfig.pageIndex,
                pageSize: queryConfig.size,
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
            }}
            size="small"
            dataSource={data.map((i) => ({ ...i, key: i.id }))}
            pagination={{
              current: queryConfig.pageIndex,
              pageSize: queryConfig.size,
              defaultPageSize: DEFAULT_PAGE_SIZE,
              total: total,
              onChange: () => scrollToTop(SCROLL_WRAPPER_ID),
            }}
            dictionary={getProTableDictionary()}
          />
        }
      />
    </Space>
  );
};

export default PageContent;
