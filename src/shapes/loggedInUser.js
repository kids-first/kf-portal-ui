import PropTypes from 'prop-types';

export default PropTypes.shape({
  roles: PropTypes.array.isRequired,
  acceptedTerms: PropTypes.bool.isRequired,
});
