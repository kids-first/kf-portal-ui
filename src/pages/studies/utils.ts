import {
  IFilter,
  IFilterCount,
  IFilterGroup,
  IFilterRange,
  VisualType,
} from '@ferlab/ui/core/components/filters/types';
import { ISqonGroupFilter, TSqonGroupContent } from '@ferlab/ui/core/components/QueryBuilder/types';
import { isEmpty } from 'lodash';
import get from 'lodash/get';
import qs from 'query-string';

export const updateFilters = (
  history: any,
  filterGroup: IFilterGroup,
  selected: IFilter[],
): void => {
  const newSelectedFilters: TSqonGroupContent = createSQONFromFilters(filterGroup, selected);

  updateQueryFilters(history, filterGroup.field, newSelectedFilters);
};

const createSQONFromFilters = (
  filterGroup: IFilterGroup,
  selectedFilters: IFilter[],
): TSqonGroupContent => {
  switch (filterGroup.type) {
    case VisualType.Range:
      return createRangeFilter(filterGroup.field, selectedFilters);
    default:
      return createInlineFilters(filterGroup.field, selectedFilters);
  }
};

const createRangeFilter = (field: string, filters: IFilter<IFilterRange>[]) => {
  const selectedFilters: TSqonGroupContent = [];
  if (filters.length === 0) {
    return selectedFilters;
  }

  const selectedRange = filters[0];
  if (selectedRange.data.min && selectedRange.data.max) {
    selectedFilters.push({
      content: { field, value: [selectedRange.data.min, selectedRange.data.max] },
      op: 'between',
    });
  } else {
    if (selectedRange.data.max) {
      selectedFilters.push({
        content: { field, value: [selectedRange.data.max] },
        op: '<=',
      });
    }
    if (selectedRange.data.min) {
      selectedFilters.push({
        content: { field, value: [selectedRange.data.min] },
        op: '>=',
      });
    }
  }

  return selectedFilters;
};

const createInlineFilters = (
  field: string,
  filters: IFilter<IFilterCount>[],
): TSqonGroupContent => {
  const arrayFilters = filters.map((v) => v.data.key);
  return arrayFilters.length > 0
    ? [
        {
          content: { field, value: arrayFilters },
          op: 'in',
        },
      ]
    : [];
};

export const updateQueryFilters = (
  history: any,
  field: string,
  filters: TSqonGroupContent,
): void => {
  const currentFilter = getFiltersQuery();

  let newFilters: ISqonGroupFilter | Record<string, never> = { content: filters, op: 'and' };
  if (!isEmpty(currentFilter)) {
    const filterWithoutSelection = getFilterWithNoSelection(currentFilter, field);
    if (isEmpty(filterWithoutSelection.content) && isEmpty(filters)) {
      newFilters = {};
    } else {
      newFilters = {
        ...filterWithoutSelection,
        content: [...filterWithoutSelection.content, ...filters],
      };
    }
  }

  updateQueryParam(history, 'filters', newFilters);
};

export const getFiltersQuery = (search: any = null): ISqonGroupFilter => {
  const filters = readQueryParam('filters', JSON.stringify({}), search);

  return JSON.parse(filters);
};

export const updateQueryParam = (history: any, key: string, value: any): void => {
  const query = getQueryParams();
  if (isEmpty(value) && !query[key]) {
    return;
  }
  if (isEmpty(value) && query[key]) {
    delete query[key];
  } else {
    query[key] = typeof value === 'object' ? JSON.stringify(value) : value;
  }
  history.push({
    search: `?${qs.stringify(query)}`,
  });
};

export const readQueryParam = <T = ''>(key: string, defaultValue: T, search: any = null): any => {
  const query = getQueryParams(search);
  return get(query, key, defaultValue);
};

const getQueryParams = (search: any = null) =>
  search ? qs.parse(search) : qs.parse(window.location.search);

const getFilterWithNoSelection = (filters: ISqonGroupFilter, field: string): ISqonGroupFilter => {
  const filtered = filters.content.filter((filter) => filter.content.field !== field);
  return {
    ...filters,
    content: filtered,
  };
};
