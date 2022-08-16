import { useEffect, useState } from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { updateActiveQueryFilters } from '@ferlab/ui/core/components/QueryBuilder/utils/useQueryBuilderState';
import { IFilter, IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import { ExtendedMapping, ExtendedMappingResults, GqlResults } from 'graphql/models';
import { getFilterGroup, getFilters } from 'graphql/utils/Filters';
import { underscoreToDot } from '@ferlab/ui/core/data/arranger/formatting';
import CustomFilterSelector from './CustomFilterSelector';
import { getFiltersDictionary } from 'utils/translation';
import { TCustomFilterMapper } from '.';
import { getSelectedFilters } from '@ferlab/ui/core/data/sqon/utils';
import { isUndefined } from 'lodash';

type OwnProps = {
  classname: string;
  index: string;
  queryBuilderId: string;
  filterKey: string;
  defaultOpen?: boolean;
  extendedMappingResults: ExtendedMappingResults;
  filtersOpen?: boolean;
  filterMapper?: TCustomFilterMapper;
};

const CustomFilterContainer = ({
  classname,
  index,
  queryBuilderId,
  filterKey,
  filtersOpen,
  defaultOpen,
  extendedMappingResults,
  filterMapper,
}: OwnProps) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [results, setResults] = useState<GqlResults<any>>();
  const found = (extendedMappingResults?.data || []).find(
    (f: ExtendedMapping) => f.field === underscoreToDot(filterKey),
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
  const filterGroup = getFilterGroup(found, aggregations, [], true);
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
