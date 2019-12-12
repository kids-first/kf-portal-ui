import PropTypes from 'prop-types';

const SecondaryNavContent = ({ children, target, location: { hash = '' } }) => {
  return hash === `#${target}` ? children : null;
};

SecondaryNavContent.propTypes = {
  target: PropTypes.string.isRequired,
  location: PropTypes.shape({ hash: PropTypes.string }).isRequired,
};

export default SecondaryNavContent;
