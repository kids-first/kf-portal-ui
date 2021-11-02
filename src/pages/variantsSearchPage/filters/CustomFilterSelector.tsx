import React, { useEffect } from 'react';
import FilterSelector, {
  FilterSelectorProps,
} from '@ferlab/ui/core/components/filters/FilterSelector';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Spin } from 'antd';

import { VARIANT_INDEX, VARIANT_REPO_CACHE_KEY } from 'pages/variantsSearchPage/constants';
import { MappingResults, useGetFilterBuckets } from 'store/graphql/utils/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';

type OwnProps = FilterSelectorProps & {
  filterKey: string;
  mappingResults: MappingResults;
  onDataLoaded: Function;
};

const CustomFilterSelector = ({
  filterKey,
  mappingResults,
  dictionary,
  filters,
  filterGroup,
  maxShowing,
  selectedFilters,
  onChange,
  onDataLoaded,
  searchInputVisible,
}: OwnProps) => {
  const { filters: queryFilters } = useFilters();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  const results = useGetFilterBuckets(
    {
      sqon: resolveSyntheticSqon(allSqons, queryFilters),
    },
    VARIANT_AGGREGATION_QUERY([filterKey], mappingResults),
    VARIANT_INDEX,
  );

  useEffect(() => {
    if (results.data) {
      onDataLoaded(results);
    }
  }, [results.data]);

  return (
    <Spin spinning={results.loading}>
      <FilterSelector
        dictionary={dictionary}
        filterGroup={filterGroup}
        filters={filters}
        maxShowing={maxShowing}
        onChange={onChange}
        searchInputVisible={searchInputVisible}
        selectedFilters={selectedFilters}
      />
    </Spin>
  );
};

export default CustomFilterSelector;
