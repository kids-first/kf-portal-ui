import React from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import {
  getFilterType,
  getSelectedFilters,
  updateFilters,
} from '@ferlab/ui/core/data/filters/utils';

import { StudiesResults } from 'store/graphql/studies/actions';
import { dotToUnderscore, keyEnhance, keyEnhanceBooleanOnly } from 'store/graphql/utils';
import { MappingResults } from 'store/graphql/utils/actions';

export const generateFilters = (results: StudiesResults, mappingResults: MappingResults) =>
  Object.keys(results.data?.aggregations || []).map((key) => {
    const found = (mappingResults?.extendedMapping || []).find(
      (f: any) => f.field === dotToUnderscore(key),
    );
    const filterGroup = {
      field: found?.field || '',
      title: found?.displayName || '',
      type: getFilterType(found?.type || ''),
    };
    // @ts-ignore
    const filters: IFilter[] = results.data.aggregations[key!].buckets.map((f: any) => ({
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
          updateFilters(history, fg, f);
        }}
        selectedFilters={selectedFilters}
      />
    );
  });
