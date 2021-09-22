import React from 'react';
import FilterContainer from '@ferlab/ui/core/components/filters/FilterContainer';
import FilterSelector from '@ferlab/ui/core/components/filters/FilterSelector';
import { IFilterGroup } from '@ferlab/ui/core/components/filters/types';
import {
  getFilterType,
  getSelectedFilters,
  updateFilters,
} from '@ferlab/ui/core/data/filters/utils';

import history from 'services/history';
import { StudiesResult } from 'store/graphql/studies/models';
import { keyEnhance, keyEnhanceBooleanOnly, underscoreToDot } from 'store/graphql/utils';
import { MappingResults } from 'store/graphql/utils/actions';
import { VariantEntity } from 'store/graphql/variants/models';

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

export interface ExtendedMapping {
  active: boolean;
  displayName: string;
  isArray: boolean;
  type: string;
  field: string;
  rangeStep?: number;
}

export type Aggs = TermAggs | RangeAggs;
export type HitsEntity = VariantEntity | StudiesResult;

const isTermAgg = (obj: any): obj is TermAggs => obj.buckets !== undefined;
const isRangeAgg = (obj: any): obj is RangeAggs => obj.stats !== undefined;

export const generateFilters = (
  results: Results,
  mappingResults: MappingResults,
  className: string = '',
  filtersOpen: boolean = true,
  showSearchInput: boolean = false,
  useFilterSelector: boolean = false,
) =>
  Object.keys(results.data?.aggregations || []).map((key) => {
    const found = (mappingResults?.extendedMapping || []).find(
      (f: ExtendedMapping) => f.field === underscoreToDot(key),
    );

    const filterGroup = getFilterGroup(found, results.data?.aggregations[key], []);
    const filters = getFilters(results.data, key, found?.type || '');
    const selectedFilters = getSelectedFilters(filters, filterGroup);
    const FilterComponent = useFilterSelector ? FilterSelector : FilterContainer;

    return (
      <div className={className} key={`${key}_${filtersOpen}`}>
        <FilterComponent
          maxShowing={5}
          isOpen={filtersOpen}
          filterGroup={filterGroup}
          filters={filters}
          onChange={(fg, f) => {
            updateFilters(history, fg, f);
          }}
          searchInputVisible={showSearchInput}
          selectedFilters={selectedFilters}
        />
      </div>
    );
  });

export interface GQLData<T extends Aggs = any> {
  aggregations: any;
  hits: {
    edges: [
      {
        node: HitsEntity;
      },
    ];
    total: number;
  };
}

const getFilters = (data: GQLData | null, key: string, type: string) => {
  if (!data || !key) return [];

  if (isTermAgg(data.aggregations[key])) {
    return data.aggregations[key!].buckets.map((f: TermAgg) => ({
      data: {
        count: f.doc_count,
        key: type === 'boolean' ? keyEnhanceBooleanOnly(f.key) : f.key,
      },
      name: keyEnhance(f.key, type),
      id: f.key,
    }));
  } else {
    if (data.aggregations[key]?.stats) {
      return [
        {
          data: { max: 1, min: 0 },
          name: keyEnhance(key, type),
          id: key,
        },
      ];
    }
  }
  return [];
};

const getFilterGroup = (
  extendedMapping: ExtendedMapping | undefined,
  aggregation: Aggs,
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
