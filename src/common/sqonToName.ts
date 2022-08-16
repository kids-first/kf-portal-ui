// @ts-nocheck
import { SET_ID_PREFIX } from '@ferlab/ui/core/data/sqon/types';

type TGetValues = (filters: Object, sets: Object) => string;

export const SET_DEFAULT_NAME = 'Untitled set';

const getValues: TGetValues = (filters, sets) => {
  const content: Array<Object> | undefined = filters.content;
  if (!content) {
    return [];
  } else if (Array.isArray(content)) {
    return content.reduce((acc, c) => [...acc, ...getValues(c, sets)], []);
  } else {
    return [
      []
        .concat(content.value || [])
        .map((v) =>
          typeof v === 'string' && v.includes(SET_ID_PREFIX)
            ? sets[v.replace(SET_ID_PREFIX, '')] || SET_DEFAULT_NAME
            : v,
        ),
    ];
  }
};

const MAX_VALUES = 6;

const filtersToName = ({ filters, max = MAX_VALUES, sets = {}, length = Infinity }) => {
  if (!filters) return '';

  const values = getValues(
    filters,
    Object.values(sets).reduce((a, b) => ({ ...a, ...b }), {}),
  );

  let total = 0;
  const name = values
    .reduce((acc, value, i, arr) => {
      if (total >= max) return acc;
      const joined = value.slice(0, max - total).join(' / ');
      total += value.length;
      return acc.concat(
        `${joined}${total > max || (total === max && i < arr.length - 1) ? '...' : ''}`,
      );
    }, [])
    .join(', ');

  return name.length <= length ? name : name.slice(0, length - 3).replace(/[, ./]*$/, '...');
};

export default filtersToName;
