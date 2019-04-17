import React from 'react';
import { SizeMe } from 'react-sizeme';
import { isObject, transform, isEqual } from 'lodash';

export const SizeProvider = props => <SizeMe refreshRate={100} {...props} />;
export const withSize = Wrapped => props => (
  <SizeProvider>{({ size }) => <Wrapped size={size} {...props} />}</SizeProvider>
);


/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export const SQONdiff = (object, base) => {
  function changes(object, base) {
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}
