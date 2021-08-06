import {
  IFilter,
  IFilterCount,
  IFilterGroup,
  IFilterRange,
  VisualType,
} from '@ferlab/ui/core/components/filters/types';
import { BooleanOperators, FieldOperators } from '@ferlab/ui/core/data/sqon/operators';
import {
  ISqonGroupFilter,
  ISyntheticSqon,
  IValueFilter,
  TSqonContent,
  TSqonGroupOp,
  TSyntheticSqonContent,
} from '@ferlab/ui/core/data/sqon/types';
import { isEmpty } from 'lodash';
import get from 'lodash/get';
import qs from 'query-string';

export const updateFilters = (
  history: any,
  filterGroup: IFilterGroup,
  selected: IFilter[],
): void => {
  const newSelectedFilters: TSqonContent = createSQONFromFilters(filterGroup, selected);

  updateQueryFilters(history, filterGroup.field, newSelectedFilters);
};

const createSQONFromFilters = (
  filterGroup: IFilterGroup,
  selectedFilters: IFilter[],
): TSqonContent => {
  switch (filterGroup.type) {
    case VisualType.Range:
      return createRangeFilter(filterGroup.field, selectedFilters);
    default:
      return createInlineFilters(filterGroup.field, selectedFilters);
  }
};

const createRangeFilter = (field: string, filters: IFilter<IFilterRange>[]) => {
  const selectedFilters: TSqonContent = [];
  if (filters.length === 0) {
    return selectedFilters;
  }

  const selectedRange = filters[0];
  if (selectedRange.data.min && selectedRange.data.max) {
    selectedFilters.push({
      content: { field, value: [selectedRange.data.min, selectedRange.data.max] },
      op: FieldOperators.between,
    });
  } else {
    if (selectedRange.data.max) {
      selectedFilters.push({
        content: { field, value: [selectedRange.data.max] },
        op: FieldOperators['<='],
      });
    }
    if (selectedRange.data.min) {
      selectedFilters.push({
        content: { field, value: [selectedRange.data.min] },
        op: FieldOperators['>='],
      });
    }
  }

  return selectedFilters;
};

export const createInlineFilters = (
  field: string,
  filters: IFilter<IFilterCount>[],
): TSqonContent => {
  const arrayFilters = filters.map((v) => v.data.key);
  return arrayFilters.length > 0
    ? [
        {
          content: { field, value: arrayFilters },
          op: FieldOperators.in,
        },
      ]
    : [];
};

export const updateQueryFilters = (
  history: any,
  field: string,
  filters: TSyntheticSqonContent,
  operator: TSqonGroupOp = BooleanOperators.and,
): void => {
  const currentFilter = getFiltersQuery();

  let newFilters: ISyntheticSqon | object = { content: filters, op: operator };

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

const getFilterWithNoSelection = (filters: ISyntheticSqon, field: string): ISyntheticSqon => {
  const filtered = filters.content.filter((filter: any) => filter.content.field !== field);
  return {
    ...filters,
    content: filtered,
  };
};

export const getFilterType = (fieldType: string): VisualType => {
  if (['long', 'float', 'integer', 'date'].includes(fieldType)) {
    return VisualType.Range;
  } else if (['boolean'].includes(fieldType)) {
    return VisualType.Toggle;
  }
  return VisualType.Checkbox;
};

const getSelectedFiltersForRange = (
  filters: IFilter[],
  filterGroup: IFilterGroup,
  selectedFilters: ISqonGroupFilter,
) => {
  const rangeData = getRangeSelection(selectedFilters, filterGroup);
  const currentFilter = filters[0] as IFilter<IFilterRange>;
  return [{ ...currentFilter, data: rangeData }];
};

const getSelectedFiltersOther = (
  filters: IFilter[],
  filterGroup: IFilterGroup,
  selectedFilters: ISqonGroupFilter,
) => {
  const currentFilters = filters as IFilter<IFilterCount>[];
  return currentFilters.reduce<IFilter<IFilterCount>[]>((acc, filter) => {
    if (isFilterSelected(selectedFilters, filterGroup, filter.data.key)) {
      acc.push(filter);
    }
    return acc;
  }, []);
};

export const getSelectedFilters = (filters: IFilter[], filterGroup: IFilterGroup): IFilter[] => {
  const selectedFilters = getFiltersQuery();
  if (isEmpty(selectedFilters)) {
    return [];
  }

  switch (filterGroup.type) {
    case VisualType.Range:
      return getSelectedFiltersForRange(filters, filterGroup, selectedFilters);
    default:
      return getSelectedFiltersOther(filters, filterGroup, selectedFilters);
  }
};

const getRangeSelection = (filters: ISqonGroupFilter, filterGroup: IFilterGroup) => {
  let rangeSelection: IFilterRange = { max: undefined, min: undefined, rangeType: undefined };
  for (const filter of filters.content) {
    const filt = filter as IValueFilter;
    if (filt.content.field === filterGroup.field) {
      if (filt.op === FieldOperators.between) {
        rangeSelection = {
          ...rangeSelection,
          max: filt.content.value[1] as number,
          min: filt.content.value[0] as number,
        };
      } else {
        const op = filt.op === FieldOperators['>='] ? 'min' : 'max';
        rangeSelection = { ...rangeSelection, [op]: filt.content.value[0] };
      }
    }
  }

  return rangeSelection;
};

const isFilterSelected = (filters: ISyntheticSqon, filterGroup: IFilterGroup, key: string) => {
  for (const filter of filters.content) {
    const filt = filter as IValueFilter;
    if (filt.content.value.includes(key) && filt.content.field === filterGroup.field) {
      return true;
    }
  }
  return false;
};

interface IMapFilters {
  [key: string]: ISqonGroupFilter | null;
}

type TFilterType = (filters: ISqonGroupFilter) => ISqonGroupFilter | null;

interface IFilterTypes {
  type: string;
  remapValues: TFilterType;
}

const emptySqon = { content: [], op: BooleanOperators.and };

export const useFilters = () => {
  let searchParams = new URLSearchParams(window.location.search);
  // @ts-ignore
  const paramsValues = [...searchParams.values()];
  // @ts-ignore
  const filters = paramsValues.length > 0 ? JSON.parse(paramsValues) : emptySqon;

  return { filters };
};

export const getQueryBuilderCache = (type: string): any => {
  const items = localStorage.getItem(`query-builder-cache-${type}`);

  if (isEmpty(items)) {
    return {};
  }

  try {
    return JSON.parse(items!);
  } catch (e) {
    return {};
  }
};

export const setQueryBuilderCache = (type: string, items: any): void => {
  localStorage.setItem(`query-builder-cache-${type}`, JSON.stringify(items));
};
