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

export type Results = {
  data: GQLData | null;
  loading: boolean;
};

export interface RangeAggs {
  stats: {
    max: number;
    min: number;
  };
}
export interface TermAggs {
  buckets: TermAgg[];
}

export interface TermAgg {
  doc_count: number;
  key: string;
}

export type Aggs = TermAggs | RangeAggs;

const isTermAgg = (obj: any): obj is TermAggs => obj.buckets !== undefined;
const isRangeAgg = (obj: any): obj is RangeAggs => obj.stats !== undefined;

export interface GQLData<T extends Aggs = any> {
  hits: any; //TODO refine type?
  aggregations: any; //TODO refine type?
}

//TODO investigate: should only be called once per tab.
export const generateFilters = (
  results: Results,
  mappingResults: MappingResults,
  className: string = '',
) =>
  Object.keys(results.data?.aggregations || []).map((key) => {
    const found = (mappingResults?.extendedMapping || []).find(
      (f: any) => f.field === underscoreToDot(key),
    );

    const filterGroup = getFilterGroup(found, results.data?.aggregations[key], []);
    const filters = getFilters(results.data, key);
    const selectedFilters = getSelectedFilters(filters, filterGroup);

    return (
      <div className={className} key={key}>
        <FilterContainer
          filterGroup={filterGroup}
          filters={filters}
          onChange={(fg, f) => {
            updateFilters(history, fg, f);
          }}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  });

const getFilters = (data: GQLData | null, key: string): IFilter[] => {
  if (!data || !key) return [];

  if (isTermAgg(data.aggregations[key])) {
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
        data: { max: 1, min: 0 },
        name: keyEnhance(key),
        id: key,
      },
    ];
  }
  return [];
};

const getFilterGroup = (
  extendedMapping: ExtendedMapping | undefined,
  aggregation: any,
  rangeTypes: string[],
): IFilterGroup => {
  if (isRangeAgg(aggregation)) {
    return {
      field: extendedMapping?.field || '',
      title: extendedMapping?.displayName || '',
      type: getFilterType(extendedMapping?.type || ''),
      config: {
        min: aggregation.stats.min,
        max: aggregation.stats.max,
        step: extendedMapping?.rangeStep || 1,
        rangeTypes: rangeTypes.map((r) => ({
          name: r,
          key: r,
        })),
      },
    };
  }

  return {
    field: extendedMapping?.field || '',
    title: extendedMapping?.displayName || '',
    type: getFilterType(extendedMapping?.type || ''),
  };
};
