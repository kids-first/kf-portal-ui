import { useState } from 'react';
import { Button, Layout, Space, Typography } from 'antd';
import intl from 'react-intl-universal';
import cx from 'classnames';
import { isEmpty } from 'lodash';

import { IExtendedMappingResults } from '@ferlab/ui/core/graphql/types';
import useQueryBuilderState from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import useGetAggregations from 'hooks/graphql/useGetAggregations';
import { AGGREGATION_QUERY } from 'graphql/queries';
import { ISqonGroupFilter, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';

import CustomFilterContainer from './CustomFilterContainer';
import { FilterGroup, FilterInfo } from './types';

import styles from 'components/uiKit/FilterList/Filters.module.scss';

export type TCustomFilterMapper = (filters: ISqonGroupFilter) => ISyntheticSqon;

type OwnProps = {
  loading?: boolean;
  index: string;
  queryBuilderId: string;
  extendedMappingResults: IExtendedMappingResults;
  filterInfo: FilterInfo;
  filterMapper?: TCustomFilterMapper;
};

const { Text } = Typography;

const isAllFacetOpen = (filterInfo: FilterInfo) => {
  const allOpen = concatAllFacets(filterInfo).every((facet) =>
    typeof facet === 'string' ? filterInfo.defaultOpenFacets?.includes(facet) : true,
  );
  return allOpen ? true : undefined;
};

const concatAllFacets = (filterInfo: FilterInfo) => {
  const allFacets: any[] = [];
  filterInfo.groups.forEach(({ facets }) => allFacets.push(...facets));
  return allFacets;
};

const FilterList = ({
  index,
  queryBuilderId,
  extendedMappingResults,
  filterInfo,
  filterMapper,
}: OwnProps) => {
  const [filtersOpen, setFiltersOpen] = useState<boolean | undefined>(isAllFacetOpen(filterInfo));
  const { queryList, activeQuery } = useQueryBuilderState(queryBuilderId);

  const filters = filterInfo.groups.flatMap(g => g.facets) as string[];
  const resolvedSqon = filterMapper
    ? filterMapper(resolveSyntheticSqon(queryList, activeQuery))
    : resolveSyntheticSqon(queryList, activeQuery);
    
  const aggQuery = AGGREGATION_QUERY(index, filters, extendedMappingResults);
  const aggResults = useGetAggregations(
    {
      sqon: resolvedSqon,
    },
    aggQuery,
    index,
  );

  if (aggResults.loading) {
    return <></>;
  }

  return (
    <>
      {!isEmpty(filterInfo.customSearches) && (
        <Space direction="vertical" size={16} className={styles.customSearchesWrapper}>
          {filterInfo.customSearches?.map((search, index) => (
            <div key={index}>{search}</div>
          ))}
        </Space>
      )}
      <div className={styles.filterExpandBtnWrapper}>
        <Button onClick={() => setFiltersOpen(!filtersOpen)} type="link">
          {filtersOpen
            ? intl.get('components.filterList.collapseAll')
            : intl.get('components.filterList.expandAll')}
        </Button>
      </div>
      <Layout className={styles.filterWrapper}>
        {filterInfo.groups.map((group: FilterGroup, i) => (
          <div key={i} className={styles.filtersGroup}>
            {group.title ? (
              <Text type="secondary" className={styles.filterGroupTitle}>
                {group.title}
              </Text>
            ) : null}
            {group.facets.map((facet, ii) =>
              typeof facet === 'string' ? (
                <CustomFilterContainer
                  key={facet}
                  filter={facet}
                  index={index}
                  queryBuilderId={queryBuilderId}
                  classname={cx(styles.customFilterContainer, styles.filter)}
                  extendedMappingResults={extendedMappingResults}
                  filtersOpen={filtersOpen}
                  defaultOpen={filterInfo.defaultOpenFacets?.includes(facet) ? true : undefined}
                  headerTooltip={group.tooltips?.includes(facet)}
                  results={aggResults}
                />
              ) : (
                <div key={i + ii} className={cx(styles.customFilterWrapper, styles.filter)}>
                  {facet}
                </div>
              ),
            )}
          </div>
        ))}
      </Layout>
    </>
  );
};

export default FilterList;
