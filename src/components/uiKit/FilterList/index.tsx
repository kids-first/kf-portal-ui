import { useState } from 'react';
import { Button, Layout, Space, Typography } from 'antd';
import CustomFilterContainer from './CustomFilterContainer';
import intl from 'react-intl-universal';
import { FilterGroup, FilterInfo } from './types';
import { ExtendedMappingResults } from 'graphql/models';
import { ISqonGroupFilter, ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import cx from 'classnames';

import styles from 'components/uiKit/FilterList/Filters.module.scss';
import { isEmpty } from 'lodash';

export type TCustomFilterMapper = (filters: ISqonGroupFilter) => ISyntheticSqon;

type OwnProps = {
  index: string;
  queryBuilderId: string;
  extendedMappingResults: ExtendedMappingResults;
  filterInfo: FilterInfo;
  filterMapper?: TCustomFilterMapper;
};

const { Text } = Typography;

const isAllFacetOpen = (filterInfo: FilterInfo) => {
  const allOpen = concatAllFacets(filterInfo).every((facet) =>
    typeof facet === 'string' ? filterInfo.defaultOpenFacets?.includes(facet) : true,
  )
  return allOpen ? true : undefined
}

const concatAllFacets = (filterInfo: FilterInfo) => {
  let allFacets: any[] = [];
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
                  index={index}
                  queryBuilderId={queryBuilderId}
                  classname={cx(styles.customFilterContainer, styles.filter)}
                  filterKey={facet}
                  extendedMappingResults={extendedMappingResults}
                  filtersOpen={filtersOpen}
                  defaultOpen={filterInfo.defaultOpenFacets?.includes(facet) ? true : undefined}
                  filterMapper={filterMapper}
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
