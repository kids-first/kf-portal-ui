import PropTypes from 'prop-types';

export default PropTypes.arrayOf(
  PropTypes.shape({
    active: PropTypes.bool.isRequired,
    displayName: PropTypes.string.isRequired,
    displayValues: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    isArray: PropTypes.bool.isRequired,
    primaryKey: PropTypes.bool.isRequired,
    quickSearchEnabled: PropTypes.bool.isRequired,
    rangeStep: PropTypes.number,
    type: PropTypes.string,
    unit: PropTypes.string,
  }),
);
