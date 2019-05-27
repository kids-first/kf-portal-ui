import { cloneDeep, isEqual } from 'lodash';

/**
 * Merge `newSqon` into `targetSqons` at `activeIndex` and return the merged sqons.
 * This operation is immutable.
 * @param {Object} newSqon - The sqon to merge into `targetSqons`
 * @param {Object} targetSqons - The sqon array to merge into
 * @param {Number} activeIndex - The index at which to merge the `newSqon`
 */
export const mergeSqonAtIndex = (newSqon, targetSqons, activeIndex) => {
  const currentContent = targetSqons[activeIndex].content;

  // skip merge if the exact same sqon in present in the target sqons,
  //  but still return a clone be consistent
  if (currentContent.some(sqon => isEqual(sqon, newSqon))) {
    return cloneDeep(targetSqons);
  }

  // clone before merging to be immutable
  const mergedSqons = cloneDeep(targetSqons);
  mergedSqons[activeIndex].content = mergedSqons[activeIndex].content.concat(newSqon);
  return mergedSqons;
};
