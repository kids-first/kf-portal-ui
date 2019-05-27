import { cloneDeep, isEqual, includes } from 'lodash';

/**
 * Merge `newSqon` into `targetSqons` at `activeIndex` and return the merged sqons.
 * This operation is immutable.
 * @param {Object} newSqon - The sqon to merge into `targetSqons`
 * @param {Object} targetSqons - The sqon array to merge into
 * @param {Number} activeIndex - The index at which to merge the `newSqon`
 */
export const mergeSqonAtIndex = (newSqon, targetSqons, activeIndex, typeChart, field) => {
  const currentContent = targetSqons[activeIndex].content;

  // For Available data, if a field exists and value does not extist, concatenate values
  if (typeChart === 'dataType') {
    currentContent.forEach(item => {
      if (item.content.field === field && !includes(item.content.value, newSqon.content.value[0])) {
        item.content.value = item.content.value.concat(newSqon.content.value);
      }
    });
  }

  // For age at diagnosis, if a field exists replace value and op
  if (typeChart === 'ageDiagnosis') {
    currentContent.forEach(item => {
      if (item.content.field === field) {
        item.content.value = newSqon.content.value;
        item.op = newSqon.op;
      }
    });
  }

  // skip merge if the exact same sqon in present in the target sqons,
  //  but still return a clone be consistent
  if (currentContent.some(sqon => isEqual(sqon.content.field, newSqon.content.field))) {
    return cloneDeep(targetSqons);
  }

  // clone before merging to be immutable
  const mergedSqons = cloneDeep(targetSqons);
  mergedSqons[activeIndex].content = mergedSqons[activeIndex].content.concat(newSqon);
  return mergedSqons;
};
