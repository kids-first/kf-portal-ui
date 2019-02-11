import PropTypes from 'prop-types';

const SecondaryNavContent = ({ children, target, location: { hash = '' } }) => {
  return hash === `#${target}` ? children : null;
};

SecondaryNavContent.PropTypes = {
  target: PropTypes.string.isRequired,
  location: PropTypes.objectOf({ hash: PropTypes.string }).isRequired,
};

export default SecondaryNavContent;
