import React from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import { IFilter, IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import {
  getFilterType,
  getSelectedFilters,
  updateFilters,
} from '@ferlab/ui/core/data/filters/utils';

import history from 'services/history';
import { keyEnhance, keyEnhanceBooleanOnly, underscoreToDot } from 'store/graphql/utils';
import { ExtendedMapping, MappingResults } from 'store/graphql/utils/actions';

type Bucket = {
  key: string;
  doc_count: number;
};

type Stats = {
  key: string;
  doc_count: number;
};

type BucketAggregations = {
  field: string;
  buckets: Bucket[];
};

type RangeAggregations = {
  field: string;
  stats: Stats;
};

export type AggregationResults = {
  bucketAggs: BucketAggregations[];
  rangeAggs: RangeAggregations[];
  loading: boolean;
};

export type Results = {
  data: GQLData | null;
  loading: boolean;
};

export type GQLData = {
  hits: any; //TODO refine type?
  aggregations: any; //TODO refine type?
};

export const generateFilters = (results: Results, mappingResults: MappingResults) =>
  Object.keys(results.data?.aggregations || []).map((key) => {
    const found = (mappingResults?.extendedMapping || []).find(
      (f: any) => f.field === underscoreToDot(key),
    );

    const filterGroup = getFilterGroup(found, ['one', 'two']);
    const filters = getFilters(results.data, key);

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

const getFilters = (data: GQLData | null, key: string): IFilter[] => {
  if (!data || !key) return [];

  if (data.aggregations[key]?.buckets) {
    return data.aggregations[key!].buckets.map((f: any) => ({
      data: {
        count: f.doc_count,
        key: keyEnhanceBooleanOnly(f.key),
      },
      name: keyEnhance(f.key),
      id: f.key,
    }));
  } else if (data.aggregations[key]?.stats) {
    return [
      {
        data: {},
        name: keyEnhance(key),
        id: key,
      },
    ];
  }
  return [];
};

const getFilterGroup = (
  extendedMapping: ExtendedMapping | undefined,
  rangeTypes: string[],
): IFilterGroup => ({
  field: extendedMapping?.field || '',
  title: extendedMapping?.displayName || '',
  type: getFilterType(extendedMapping?.type || ''),
  config:
    rangeTypes.length > 0
      ? {
          min: 1,
          max: 2,
          rangeTypes: rangeTypes.map((r) => ({
            name: r,
            key: r,
          })),
        }
      : undefined,
});
