import PropTypes from 'prop-types';

export const fieldSqonShape = PropTypes.shape({
  field: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any).isRequired,
});

/**
 * @description - A shape representing a sqon object.
 * @example
 *  {
 *    op: 'and',
 *    content: [{
 *      op: 'in',
 *      content: { field: 'name', value: ['Bob', 'Alice'] },
 *    }],
 *  }
 */
export const opSqonShape = PropTypes.shape({
  op: PropTypes.string.isRequired,
});
// allow for circular shape
opSqonShape.content = PropTypes.arrayOf(
  PropTypes.oneOfType([opSqonShape, fieldSqonShape]),
).isRequired;

export default opSqonShape;
