import { useEffect, useState } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter, IFilterGroup, TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import { updateActiveQueryFilters } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { IExtendedMappingResults, IGqlResults } from '@ferlab/ui/core/graphql/types';
import { getFilters } from 'graphql/utils/Filters';
import { isUndefined } from 'lodash';
import { getFilterGroup } from '@ferlab/ui/core/data/filters/utils';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import { getFacetsDictionary, getFiltersDictionary } from 'utils/translation';

import { underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import CustomFilterSelector from './CustomFilterSelector';

type OwnProps = {
  classname: string;
  index: string;
  queryBuilderId: string;
  filter: string;
  defaultOpen?: boolean;
  extendedMappingResults: IExtendedMappingResults;
  filtersOpen?: boolean;
  headerTooltip?: boolean;
  noDataInputOption?: boolean;
  results: IGqlResults<any>;
};

const CustomFilterContainer = ({
  classname,
  index,
  queryBuilderId,
  filtersOpen,
  defaultOpen,
  extendedMappingResults,
  filter,
  headerTooltip,
  noDataInputOption,
  results,
}: OwnProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  useEffect(() => {
    if (!isUndefined(filtersOpen) && isOpen !== filtersOpen) {
      setIsOpen(filtersOpen);
    }
    // eslint-disable-next-line
  }, [filtersOpen]);

  const onFilterSelectorChange = (fg: IFilterGroup, f: IFilter[]) => {
    updateActiveQueryFilters({
      queryBuilderId,
      filterGroup: fg,
      selectedFilters: f,
      index,
    });
  };

  const found = (extendedMappingResults?.data || []).find(
    (f: TExtendedMapping) => f.field === underscoreToDot(filter),
  );

  const aggregations = results?.aggregations ? results?.aggregations[filter] : null; 

  const filterGroup = getFilterGroup({
    extendedMapping: found,
    aggregation: aggregations || {},
    rangeTypes: [],
    filterFooter: true,
    headerTooltip,
    dictionary: getFacetsDictionary(),
    noDataInputOption,
  });

  const filters = results?.aggregations ? getFilters(results?.aggregations, filter) : [];
  const selectedFilters = results?.data
    ? getSelectedFilters({
        queryBuilderId,
        filters,
        filterGroup,
      })
    : [];

  return (
    <div className={classname} key={filter}>
      <FilterContainer
        maxShowing={5}
        isOpen={isOpen}
        filterGroup={filterGroup}
        filters={filters}
        onChange={() => {}}
        selectedFilters={selectedFilters}
        onSearchVisibleChange={setIsSearchVisible}
        collapseProps={{
          headerBorderOnly: true,
        }}
        customContent={
          <CustomFilterSelector
            dictionary={getFiltersDictionary()}
            filters={filters}
            filterGroup={filterGroup}
            maxShowing={5}
            onChange={onFilterSelectorChange}
            selectedFilters={selectedFilters}
            searchInputVisible={isSearchVisible}
          />
        }
      />
    </div>
  );
};

export default CustomFilterContainer;
