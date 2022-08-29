import ProTable from '@ferlab/ui/core/components/ProTable';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { UserOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { getProTableDictionary } from 'utils/translation';
import intl from 'react-intl-universal';
import { isEmptySqon, resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { combineExtendedMappings } from 'utils/fieldMapper';

import styles from './index.module.scss';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { IStudyEntity } from 'graphql/studies/models';
import QueryBuilder from '@ferlab/ui/core/components/QueryBuilder';
import { getQueryBuilderDictionary } from 'utils/translation';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_QUERY_CONFIG,
  SCROLL_WRAPPER_ID,
  STUDIES_QB_ID,
} from '../utils/constant';
import { ExtendedMapping, ExtendedMappingResults } from 'graphql/models';
import { useEffect, useState } from 'react';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { useStudies } from 'graphql/studies/actions';
import isEmpty from 'lodash/isEmpty';
import { formatQuerySortList, scrollToTop } from 'utils/helper';

const { Title } = Typography;

type OwnProps = {
  defaultColumns: ProColumnType<any>[];
  extendedMappingResults?: ExtendedMappingResults;
};

const PageContent = ({
  defaultColumns = [],
  extendedMappingResults = { data: [], loading: false },
}: OwnProps) => {
  console.log('---PageContent---'); //TODO: to remove
  const { queryList, activeQuery } = useQueryBuilderState(STUDIES_QB_ID);
  const [queryConfig, setQueryConfig] = useState(DEFAULT_QUERY_CONFIG);
  const resolvedSqon = resolveSyntheticSqon(queryList, activeQuery);

  const { loading, total, data } = useStudies({
    first: queryConfig.size,
    offset: queryConfig.size * (queryConfig.pageIndex - 1),
    sqon: resolvedSqon,
    sort: isEmpty(queryConfig.sort) ? [{ field: 'variant_class', order: 'asc' }] : queryConfig.sort,
  });

  console.log('results', loading, total, data); //TODO: to remove

  useEffect(() => {});

  const facetTransResolver = (key: string) => {
    const title = intl.get(`facets.${key}`);
    return title
      ? title
      : combineExtendedMappings([extendedMappingResults])?.data?.find(
          (mapping: ExtendedMapping) => key === mapping.field,
        )?.displayName || key;
  };

  return (
    <Space direction="vertical" size={16} className={styles.pageContent}>
      <Title className={styles.title} level={4}>
        {intl.get('screen.studies.title')}
      </Title>
      <QueryBuilder
        id={STUDIES_QB_ID}
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
        enableShowHideLabels
        IconTotal={<UserOutlined size={18} />}
        currentQuery={isEmptySqon(activeQuery) ? {} : activeQuery}
        total={total}
        dictionary={getQueryBuilderDictionary(facetTransResolver)}
        getResolvedQueryForCount={() => ({ op: 'and', content: [] })}
        fetchQueryCount={() =>
          new Promise((resolve, reject) => {
            resolve(1);
          })
        }
      />
      <GridCard
        content={
          <ProTable
            tableId="studies_table"
            columns={defaultColumns}
            wrapperClassName={styles.tableWrapper}
            loading={loading}
            bordered
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
                total,
              },
            }}
            size="small"
            dataSource={data}
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
