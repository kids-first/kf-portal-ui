import {
  BOOLEAN_OPS,
  isEmptySqon as arrangerIsEmptySqon,
  isReference,
} from '@kfarranger/components/dist/AdvancedSqonBuilder/utils';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import merge from 'lodash/merge';
import union from 'lodash/union';

/**
 * Returns a default, empty sqon.
 * @returns {Object[]} - A copy of an empty sqon.
 */
export const getDefaultSqon = () => cloneDeep([{ op: 'and', content: [] }]);

/**
 * Check wether this is a default, empty sqon.
 * @param {Object[]} sqons - an array of sqon object.
 * @returns {boolean} `true` if it is a default sqon; `false` otherwise.
 */
export const isDefaultSqon = (sqons) => isEqual(sqons, getDefaultSqon());

/**
 * Sets the value in the given `newSqon` to the `sourceSqons` at the given `sourceIndex`.
 * Merging behavoir can be provided with `opts`.
 * This does not mutates the original `sourceSqons`.
 * @param {Object[]} sourceSqons - an array of sqons
 * @param {Number} sourceIndex - the index at which the change must be made
 * @param {Object} newSqon - a sqon representing the value to set and, optionaly, the operator
 * @param {{values:MERGE_STRATEGIES,operator:MERGE_STRATEGIES}} opts - options to handle how to merge the values or the operator
 * @returns {Object} a new sqon including the `newSqon`.
 */
export const setSqonValueAtIndex = (sourceSqons, sourceIndex, newSqon, opts) => {
  // clone targetSqons to preserve immutability
  const clonedSqons = cloneDeep(sourceSqons);

  // default values
  opts = merge(
    {},
    {
      values: MERGE_VALUES_STRATEGIES.DEFAULT,
      operator: MERGE_OPERATOR_STRATEGIES.DEFAULT,
    },
    opts,
  );

  // try to recursively traverse the sqon and mutate the matching field
  const found = deeplySetSqonValue(clonedSqons[sourceIndex], newSqon, opts);

  if (!found) {
    if (!newSqon.op) {
      throw new Error(
        `Cannot add the field "${newSqon.content.field}" to the sqons:` +
          ` no operator provided and no matching field found in sqons`,
      );
    }
    clonedSqons[sourceIndex].content.push(newSqon);
  }

  return clonedSqons;
};

/**
 * Recursively traverse the `sourceSqon` and mutate the matching field's value and, optionaly, it's operator.

 * @param {Object} sourceSqon - a sqon object to traverse recursively and mutate
 * @param {Object} newSqon - a sqon, that may omit the operator,
 * that provide the field name searched and value to be set
 * @param {Object} opts - options to handle merging the values.
 * 
 * @returns `true` if the field was found; `false` otherwise.
 */
const deeplySetSqonValue = (sourceSqon, newSqon, opts) => {
  let found = false;

  sourceSqon.content.forEach((sqon) => {
    // dont follow references
    if (isReference(sqon)) return;

    // traverse nested sqons recursively
    if (BOOLEAN_OPS.includes(sqon.op)) {
      found = deeplySetSqonValue(sqon, newSqon, opts);
      return;
    }

    // field found, set the value and operator
    if (sqon.content.field === newSqon.content.field) {
      found = true;

      if (newSqon.op) {
        if (opts.operator !== MERGE_OPERATOR_STRATEGIES.KEEP_OPERATOR) {
          sqon.op = newSqon.op;
        }
      }

      if (opts.values === MERGE_VALUES_STRATEGIES.APPEND_VALUES) {
        sqon.content.value = union([], sqon.content.value, newSqon.content.value);
      }

      if (opts.values === MERGE_VALUES_STRATEGIES.OVERRIDE_VALUES) {
        sqon.content.value = newSqon.content.value;
      }
    }
  });

  return found;
};

/**
 * Strategy to use to merge the values of the field.
 */
export const MERGE_VALUES_STRATEGIES = {
  /**
   * Defaults to `OVERRIDE_VALUES`
   */
  DEFAULT: 'OVERRIDE_VALUES',
  /**
   * Replaces existing values with provided ones
   */
  OVERRIDE_VALUES: 'OVERRIDE_VALUES',
  /**
   * Append provided values to existing ones
   */
  APPEND_VALUES: 'APPEND_VALUES',
};

/**
 * Strategy to use to merge the operator of the field.
 */
export const MERGE_OPERATOR_STRATEGIES = {
  /**
   * Defaults to `OVERRIDE_OPERATOR`
   */
  DEFAULT: 'OVERRIDE_OPERATOR',
  /**
   * Replaces existing operator with provided one
   */
  OVERRIDE_OPERATOR: 'OVERRIDE_OPERATOR',
  /**
   * Keep the current operator.
   * The one provided will be used if the field is not found.
   */
  KEEP_OPERATOR: 'KEEP_OPERATOR',
};

const isEmptySqon = (sqon) => arrangerIsEmptySqon(sqon);

const isEmptyQuery = (querySqons) => querySqons.length === 1 && isEmptySqon(querySqons[0]);

const fromSetIdToSetSqon = (setId) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'kf_id',
        value: [`set_id:${setId}`],
      },
    },
  ],
});

export const termToSqon = ({ field, value }) => ({
  op: 'in',
  content: {
    field: field,
    value: [value].flat(),
  },
});

export const addToSqons = ({ fieldsWValues, sqons }) => {
  const currentSqon = {
    content: fieldsWValues.map(({ field, value }) => ({ ...termToSqon({ field, value }) })),
    op: 'and',
  };

  if (!sqons || sqons.length === 0) {
    return [currentSqon];
  }

  if (isEmptySqon(sqons[sqons.length - 1])) {
    return [...sqons.slice(0, sqons.length - 1), currentSqon];
  }

  return [...sqons, currentSqon];
};

export const createNewQueryFromSetId = (setId, querySqons) => {
  const setSqon = fromSetIdToSetSqon(setId);
  if (isEmptyQuery(querySqons)) {
    return [setSqon];
  }
  return [...querySqons, setSqon];
};

export const addSetToActiveQuery = ({ setId, querySqons, activeIndex }) => {
  if (isEmptyQuery(querySqons)) {
    const setSqon = fromSetIdToSetSqon(setId);
    return [setSqon];
  }

  const newSqons = querySqons.slice(0);
  const activeSqon = { ...querySqons[activeIndex] };
  const activeContent = activeSqon.content.slice(0);

  //  Assumes that content can contain at most 1 element with a set.
  const contentIndexOfSet = activeContent.findIndex((currentSqon) => {
    const currentContent = currentSqon.content;
    const currentValue = currentContent.value || [];
    if (Array.isArray(currentValue)) {
      return currentValue.some((strValue) => strValue.startsWith('set_id:'));
    }
    return currentValue.startsWith('set_id:');
  });

  let updatedContent;
  const setIdNotDetected = contentIndexOfSet === -1;
  if (setIdNotDetected) {
    updatedContent = [
      ...activeContent,
      {
        op: 'in',
        content: {
          field: 'kf_id',
          value: [`set_id:${setId}`],
        },
      },
    ];
  } else {
    const sqonWithOtherSet = activeContent[contentIndexOfSet];
    const contentWithOtherSet = sqonWithOtherSet.content;
    const valueWithOtherSet = contentWithOtherSet.value;
    const updatedValue = Array.isArray(valueWithOtherSet)
      ? [...valueWithOtherSet, `set_id:${setId}`]
      : [valueWithOtherSet, `set_id:${setId}`];
    const updatedValueWithNoDuplicate = [...new Set(updatedValue)];
    activeContent[contentIndexOfSet] = {
      ...sqonWithOtherSet,
      content: {
        ...contentWithOtherSet,
        value: updatedValueWithNoDuplicate,
      },
    };
    updatedContent = activeContent;
  }

  activeSqon.content = updatedContent;
  newSqons[activeIndex] = activeSqon;
  return newSqons;
};

export const addFieldToActiveQuery = ({ term, querySqons, activeIndex, sqonOp }) => {
  const newActiveSqon = addFieldToActiveSqon(term, querySqons[activeIndex].content, sqonOp);

  const newQuerySqon = [...querySqons];

  newQuerySqon[activeIndex] = { op: newQuerySqon[activeIndex].op, content: newActiveSqon };
  return newQuerySqon;
};

const addFieldToActiveSqon = (term, activeSqon, sqonOp) => {
  const sameTermIndex = activeSqon.findIndex((s) => s.content.field === term.field);
  if (sameTermIndex >= 0) {
    const valuesAsSet = new Set();
    activeSqon[sameTermIndex].content.value.forEach((v) => valuesAsSet.add(v));
    valuesAsSet.add(term.value);
    return activeSqon.map((s) => {
      if (s.content.field === term.field) {
        return {
          ...s,
          content: { field: term.field, value: [...valuesAsSet] },
          op: sqonOp || s.op,
        };
      } else {
        return { ...s };
      }
    });
  }
  return [...activeSqon, termToSqon(term)];
};
