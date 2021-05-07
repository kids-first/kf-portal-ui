/* eslint-disable react/display-name */
import React from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter } from '@ferlab/ui/core/components/filters/types';

import history from 'services/history';
import { SidebarData } from 'store/graphql/studies/actions';

import { getFilterType, getSelectedFilters, updateFilters } from './utils';

const keyEnhance = (key: string) => {
  switch (key) {
    case '__missing__':
      return ' No Data';
    case '1':
      return 'True';
    case '0':
      return 'False';
    default:
      return key;
  }
};

const keyEnhanceBooleanOnly = (key: string) => {
  switch (key) {
    case '1':
      return 'true';
    case '0':
      return 'false';
    default:
      return key;
  }
};

type StudiesProps = {
  onChange: () => void;
};
type OwnProps = SidebarData & StudiesProps;

const SidebarFilters = ({ studiesResults, studiesMappingResults, onChange }: OwnProps) => {
  const mappingData = studiesMappingResults;
  const data = studiesResults;

  if (mappingData?.loadingMapping || !mappingData?.extendedMapping || data.loading || !data.data) {
    return null;
  }

  return (
    <>
      {Object.keys(data.data.aggregations).map((key) => {
        const found = studiesMappingResults.extendedMapping.find((f: any) => f.field === key);
        const filterGroup = {
          field: found!.field,
          title: found!.displayName,
          type: getFilterType(found!.type),
        };
        // @ts-ignore
        const filters: IFilter[] = studiesResults.data.aggregations[key!].buckets.map((f: any) => ({
          data: {
            count: f.doc_count,
            key: keyEnhanceBooleanOnly(f.key),
          },
          name: keyEnhance(f.key),
          id: f.key,
        }));
        const selectedFilters = getSelectedFilters(filters, filterGroup);
        return (
          <FilterContainer
            key={key}
            filterGroup={filterGroup}
            filters={filters}
            onChange={(fg, f) => {
              onChange();
              updateFilters(history, fg, f);
            }}
            selectedFilters={selectedFilters}
          />
        );
      })}
    </>
  );
};

export default SidebarFilters;
