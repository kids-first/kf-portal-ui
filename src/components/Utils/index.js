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
        result[key] = isObject(value) && isObject(base[key]) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
};

const validStylesMap = new Set(Object.keys(document.createElement('div').style));
const shorthandSpacersRegex = /^((m|p)[trbl]?)$/;
const shorthandSpacers = {
  p: 'padding',
  pt: 'paddingTop',
  pr: 'paddingRight',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  m: 'margin',
  mt: 'marginTop',
  mr: 'marginRight',
  mb: 'marginBottom',
  ml: 'marginLeft',
};
const splitStylesFromAttributes = props => {
  if (typeof props !== 'object') {
    return { styles: {}, attributes: {} };
  }

  return Object.keys(props).reduce(
    (result, key) => {
      const value = props[key];

      // filter some property that should not be forwarded
      if (['style', 'innerRef'].includes(key)) {
        return result;
      }

      // shorthand properties
      const results = shorthandSpacersRegex.exec(key);
      if (results !== null) {
        result.styles[shorthandSpacers[key]] = value;
        return result;
      }

      // check if its a valid style
      if (validStylesMap.has(key)) {
        result.styles[key] = value;
        return result;
      }

      // pass as a standard attribute
      result.attributes[key] = value;
      return result;
    },
    { styles: {}, attributes: {} },
  );
};

/**
 * Decorates a Component with classes.
 * @param {object|string|Function} Component - The component to add styles to
 * @param {string} classes - a string of classNames
 */
export const styleComponent = (Component, classes = '') => ({
  children = null,
  className = '',
  ...props
}) => {
  const joinedClasses = `${classes} ${className}`;

  if (typeof Component === 'string') {
    const { styles, attributes } = splitStylesFromAttributes(props);
    return (
      <Component
        className={joinedClasses}
        {...attributes}
        style={{
          ...(props.style || {}),
          ...styles,
        }}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component className={joinedClasses} {...props}>
      {children}
    </Component>
  );
};
