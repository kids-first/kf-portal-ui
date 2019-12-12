import React from 'react';
import PropTypes from 'prop-types';
import SplashPage from 'components/SplashPage';

const Error = ({ text = 'An error has occurred, please try again later' }) => (
  <SplashPage>
    <div style={{ textAlign: 'center' }}>{text}</div>
  </SplashPage>
);

Error.propTypes = {
  text: PropTypes.string,
};

export default Error;
