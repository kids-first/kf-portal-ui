import PropTypes from 'prop-types';

export default PropTypes.shape({
  setUser: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  clearIntegrationTokens: PropTypes.func.isRequired,
});
