import { useEffect, useState } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter, IFilterGroup, TExtendedMapping } from '@ferlab/ui/core/components/filters/types';
import { updateActiveQueryFilters } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import { getFilterGroup } from '@ferlab/ui/core/data/filters/utils';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import { IExtendedMappingResults, IGqlResults } from '@ferlab/ui/core/graphql/types';
import { getFilters } from 'graphql/utils/Filters';
import { isUndefined } from 'lodash';

import { getFacetsDictionary, getFiltersDictionary } from 'utils/translation';

import CustomFilterSelector from './CustomFilterSelector';
import { TCustomFilterMapper } from '.';

type OwnProps = {
  classname: string;
  index: string;
  queryBuilderId: string;
  filterKey: string;
  defaultOpen?: boolean;
  extendedMappingResults: IExtendedMappingResults;
  filtersOpen?: boolean;
  filterMapper?: TCustomFilterMapper;
  headerTooltip?: boolean;
  noDataInputOption?: boolean;
};

const CustomFilterContainer = ({
  classname,
  index,
  queryBuilderId,
  filtersOpen,
  defaultOpen,
  extendedMappingResults,
  filterKey,
  filterMapper,
  headerTooltip,
  noDataInputOption,
}: OwnProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [results, setResults] = useState<IGqlResults<any>>();
  const found = (extendedMappingResults?.data || []).find(
    (f: TExtendedMapping) => f.field === underscoreToDot(filterKey),
  );

  useEffect(() => {
    if (!isUndefined(filtersOpen) && isOpen !== filtersOpen) {
      setIsOpen(filtersOpen);
    }
    // eslint-disable-next-line
  }, [filtersOpen]);

  const onChange = (fg: IFilterGroup, f: IFilter[]) => {
    updateActiveQueryFilters({
      queryBuilderId,
      filterGroup: fg,
      selectedFilters: f,
      index,
    });
  };

  const aggregations = results?.aggregations ? results?.aggregations[filterKey] : {};

  const filterGroup = getFilterGroup({
    extendedMapping: found,
    aggregation: aggregations,
    rangeTypes: [],
    filterFooter: true,
    headerTooltip,
    dictionary: getFacetsDictionary(),
    noDataInputOption,
  });

  const filters = results?.aggregations ? getFilters(results?.aggregations, filterKey) : [];
  const selectedFilters = results?.data
    ? getSelectedFilters({
        queryBuilderId,
        filters,
        filterGroup,
      })
    : [];

  return (
    <div className={classname} key={filterKey}>
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
            index={index}
            queryBuilderId={queryBuilderId}
            filterKey={filterKey}
            dictionary={getFiltersDictionary()}
            filters={filters}
            filterGroup={filterGroup}
            maxShowing={5}
            onChange={onChange}
            selectedFilters={selectedFilters}
            searchInputVisible={isSearchVisible}
            onDataLoaded={setResults}
            extendedMappingResults={extendedMappingResults}
            filterMapper={filterMapper}
          />
        }
      />
    </div>
  );
};

export default CustomFilterContainer;
