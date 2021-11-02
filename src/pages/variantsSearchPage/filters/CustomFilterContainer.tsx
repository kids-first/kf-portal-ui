import React, { useState } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter, IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import { getSelectedFilters, updateFilters } from '@ferlab/ui/core/data/filters/utils';

import {
  ExtendedMapping,
  getFilterGroup,
  getFilters,
  MAX_BUCKETS_DISPLAY,
  Results,
} from 'components/Utils/utils';
import history from 'services/history';
import { underscoreToDot } from 'store/graphql/utils';
import { MappingResults } from 'store/graphql/utils/actions';

import CustomFilterSelector from './CustomFilterSelector';

type OwnProps = {
  classname: string;
  filterKey: string;
  mappingResults: MappingResults;
  filtersOpen: boolean;
};

const CustomFilterContainer = ({ classname, filterKey, filtersOpen, mappingResults }: OwnProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [results, setResults] = useState<Results>();
  const found = (mappingResults?.extendedMapping || []).find(
    (f: ExtendedMapping) => f.field === underscoreToDot(filterKey),
  );

  const onChange = (fg: IFilterGroup, f: IFilter[]) => {
    updateFilters(history, fg, f);
  };

  const aggregations = results?.data ? results?.data.aggregations[filterKey] : {};
  const filterGroup = getFilterGroup(found, aggregations, [], true);
  const filters = results?.data ? getFilters(results?.data, filterKey, found?.type || '') : [];
  const selectedFilters = results?.data ? getSelectedFilters(filters, filterGroup) : [];

  return (
    <div className={classname} key={`${filterKey}_${filtersOpen}`}>
      <FilterContainer
        maxShowing={5}
        isOpen={filtersOpen}
        filterGroup={filterGroup}
        filters={filters}
        onChange={() => {}}
        selectedFilters={selectedFilters}
        onSearchVisibleChange={setIsSearchVisible}
        customContent={
          <CustomFilterSelector
            dictionary={{}}
            filters={filters}
            filterGroup={filterGroup}
            maxShowing={aggregations?.buckets?.length > MAX_BUCKETS_DISPLAY ? 100 : 5}
            onChange={onChange}
            filterKey={filterKey}
            mappingResults={mappingResults}
            selectedFilters={selectedFilters}
            searchInputVisible={isSearchVisible}
            onDataLoaded={setResults}
          />
        }
      />
    </div>
  );
};

export default CustomFilterContainer;
