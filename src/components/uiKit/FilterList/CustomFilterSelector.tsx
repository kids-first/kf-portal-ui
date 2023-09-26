import { useEffect } from 'react';
import FilterSelector, {
  FilterSelectorProps,
} from '@ferlab/ui/core/components/filters/FilterSelector';

const CustomFilterSelector = ({
  dictionary,
  filters,
  filterGroup,
  maxShowing,
  selectedFilters,
  onChange,
  searchInputVisible,
}: FilterSelectorProps) => (
  <FilterSelector
    dictionary={dictionary}
    filterGroup={filterGroup}
    filters={filters}
    maxShowing={maxShowing}
    onChange={onChange}
    searchInputVisible={searchInputVisible}
    selectedFilters={selectedFilters}
  />
);

export default CustomFilterSelector;
